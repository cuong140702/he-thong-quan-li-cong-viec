import { HttpException, Injectable } from '@nestjs/common'
import { UserRepo } from 'src/routes/user/user.repo'
import { CreateUserBodyType, GetUsersQueryType, LoginBodyType, RefreshTokenBodyType } from 'src/routes/user/user.model'
import { HashingService } from 'src/shared/services/hashing.service'
import { TokenService } from 'src/shared/services/token.service'
import { AccessTokenPayloadCreate } from 'src/shared/types/jwt.type'

@Injectable()
export class UserService {
  constructor(
    private userRepo: UserRepo,
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
  ) {}

  list(pagination: GetUsersQueryType) {
    return this.userRepo.list(pagination)
  }

  async login(body: LoginBodyType) {
    // 1. Lấy thông tin user, kiểm tra user có tồn tại hay không, mật khẩu có đúng không
    const user = await this.userRepo.findUniqueUserIncludeRole({
      email: body.email,
    })
    if (!user) {
      throw new Error('Không tìm thấy người dùng với email đã cung cấp.')
    }

    const isPasswordMatch = await this.hashingService.compare(body.password, user.password)
    if (!isPasswordMatch) {
      throw new Error('Mật khẩu không chính xác. Vui lòng thử lại.')
    }

    // 4. Tạo mới accessToken và refreshToken
    const tokens = await this.generateTokens({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      roleId: user.roleId,
    })
    return tokens
  }

  async generateTokens({ userId, email, fullName, roleId }: AccessTokenPayloadCreate) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken({
        userId,
        email,
        fullName,
        roleId,
      }),
      this.tokenService.signRefreshToken({
        userId,
      }),
    ])
    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
    await this.userRepo.createRefreshToken({
      token: refreshToken,
      userId,
      expiredAt: new Date(decodedRefreshToken.exp * 1000),
    })
    return { accessToken, refreshToken }
  }

  async refreshToken({ token }: RefreshTokenBodyType) {
    try {
      const { userId } = await this.tokenService.verifyRefreshToken(token)
      // 2. Kiểm tra refreshToken có tồn tại trong database không
      const refreshTokenInDb = await this.userRepo.findUniqueRefreshTokenIncludeUserRole({
        token: token,
      })
      if (!refreshTokenInDb) {
        throw new Error('Refresh token này đã được sử dụng.')
      }
      const {
        user: { roleId, email, fullName },
      } = refreshTokenInDb
      const $deleteRefreshToken = this.userRepo.deleteRefreshToken({
        token: token,
      })
      const $tokens = this.generateTokens({ userId, roleId, email, fullName })
      const [, tokens] = await Promise.all([$deleteRefreshToken, $tokens])
      return tokens
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new Error('Không có quyền truy cập.')
    }
  }

  async createUser({ data }: { data: CreateUserBodyType }) {
    const existingUser = await this.userRepo.findUniqueUserIncludeRole({
      email: data.email,
    })
    if (existingUser) {
      throw new Error('Email đã được sử dụng.')
    }

    const hashedPassword = await this.hashingService.hash(data.password)
    const user = await this.userRepo.createUser({
      data: {
        ...data,
        password: hashedPassword,
      },
    })
    return user
  }
}
