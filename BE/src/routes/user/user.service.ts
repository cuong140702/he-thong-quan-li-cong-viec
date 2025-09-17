import { HttpException, Injectable } from '@nestjs/common'
import { UserRepo } from 'src/routes/user/user.repo'
import {
  CreateUserBodyType,
  GetUsersQueryType,
  LoginBodyType,
  RefreshTokenBodyType,
  UpdateUserBodyType,
} from 'src/routes/user/user.model'
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
      roleName: user.role.name,
    })

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roleId: user.roleId,
        role: user.role?.name,
      },
    }
  }

  async generateTokens({ userId, email, fullName, roleId, roleName }: AccessTokenPayloadCreate) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken({
        userId,
        email,
        fullName,
        roleId,
        roleName,
      }),
      this.tokenService.signRefreshToken({
        userId,
      }),
    ])
    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
    await this.userRepo.createRefreshToken({
      refreshToken,
      userId,
      expiredAt: new Date(decodedRefreshToken.exp * 1000),
    })
    return { accessToken, refreshToken }
  }

  async refreshToken({ refreshToken }: RefreshTokenBodyType) {
    try {
      const { userId } = await this.tokenService.verifyRefreshToken(refreshToken)

      const refreshTokenInDb = await this.userRepo.findUniqueRefreshTokenIncludeUserRole({
        refreshToken,
      })

      if (!refreshTokenInDb) {
        throw new Error('Refresh token này đã được sử dụng.')
      }

      const {
        user: { id, roleId, email, fullName, role },
      } = refreshTokenInDb

      const $deleteRefreshToken = this.userRepo.deleteRefreshToken({ refreshToken })

      const $tokens = this.generateTokens({ userId: id, roleId, email, fullName, roleName: role.name })

      const [, tokens] = await Promise.all([$deleteRefreshToken, $tokens])

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id,
          email,
          fullName,
          roleId,
          role: role?.name || null,
        },
      }
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

    // Hash the password
    const hashedPassword = await this.hashingService.hash(data.password)

    const user = await this.userRepo.createUser({
      data: {
        ...data,
        password: hashedPassword,
      },
    })
    return user
  }

  async updateUser({ data, id }: { data: UpdateUserBodyType; id: string }) {
    const user = await this.userRepo.findUniqueUserIncludeRole({
      id,
    })
    if (!user) {
      throw new Error('Không tìm thấy người dùng với ID đã cung cấp.')
    }

    if (data.email && data.email !== user.email) {
      const existingUser = await this.userRepo.findUniqueUserIncludeRole({
        email: data.email,
      })
      if (existingUser) {
        throw new Error('Email đã được sử dụng.')
      }
    }

    return await this.userRepo.updateUser(
      { id },
      {
        ...data,
      },
    )
  }

  async deleteUser({ id }: { id: string }) {
    try {
      await this.userRepo.deleteUser({
        id,
      })
      return {
        message: 'Delete successfully',
      }
    } catch (error) {
      throw error
    }
  }

  async logout(refreshToken: string) {
    try {
      // 1. Kiểm tra refreshToken có hợp lệ không
      await this.tokenService.verifyRefreshToken(refreshToken)

      // 2. Xóa refreshToken trong database
      const deleted = await this.userRepo.deleteRefreshToken({ refreshToken })

      if (!deleted) {
        throw new Error('Không tìm thấy hoặc không thể xóa refreshToken')
      }

      return { message: 'Đăng xuất thành công' }
    } catch (error) {
      console.error('Lỗi khi logout:', error)
      throw new Error('Đăng xuất thất bại')
    }
  }

  async getUserById({ id }: { id: string }) {
    return await this.userRepo.getUserById(id)
  }
}
