import { INestApplicationContext } from '@nestjs/common'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { ServerOptions, Server, Socket } from 'socket.io'
import { TokenService } from 'src/shared/services/token.service'

export class WebsocketAdapter extends IoAdapter {
  private readonly tokenService: TokenService

  constructor(app: INestApplicationContext) {
    super(app)
    this.tokenService = app.get(TokenService)
  }
  createIOServer(port: number, options?: ServerOptions) {
    const server: Server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: '*',
        credentials: true,
      },
    })

    server.use((socket, next) => {
      this.authMiddleware(socket, next).catch(next)
    })

    server.of(/.*/).use((socket, next) => {
      this.authMiddleware(socket, next).catch(next)
    })
    return server
  }

  async authMiddleware(socket: Socket, next: (err?: any) => void) {
    const { authorization } = socket.handshake.headers
    if (!authorization) {
      return next(new Error('Thiếu Authorization header'))
    }
    const accessToken = authorization.split(' ')[1]
    if (!accessToken) {
      return next(new Error('Thiếu access token'))
    }
    try {
      const { userId } = await this.tokenService.verifyAccessToken(accessToken)
      await socket.join(generateRoomUserId(userId))
      next()
    } catch (error) {
      next(error)
    }
  }
}

export const generateRoomUserId = (userId: string) => {
  return `${userId}`
}
