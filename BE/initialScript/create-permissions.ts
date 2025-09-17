import { NestFactory } from '@nestjs/core'
import { AppModule } from 'src/app.module'
import { HTTPMethod, RoleName } from 'src/shared/constants/role.constant'
import { PrismaService } from 'src/shared/services/prisma.service'

const ClientModule = ['TASK', 'USER', 'TAG', 'ROLE', 'PERMISSION', 'TIMELOG', 'DASHBOARD', 'MESSAGES']

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(3010)
  const prisma = app.get(PrismaService)

  const server = app.getHttpAdapter().getInstance()
  const router = server.router.stack

  const availableRoutes = router
    .map((layer) => {
      if (layer.route) {
        const path = layer.route.path
        const method = String(layer.route.stack[0].method).toUpperCase() as keyof typeof HTTPMethod
        const module = path.split('/')[1]?.toUpperCase() || 'UNKNOWN'

        return {
          path,
          method,
          module,
        }
      }
    })
    .filter(Boolean) as { path: string; method: keyof typeof HTTPMethod; module: string }[]

  const existingPermissions = await prisma.permission.findMany({
    where: { deletedAt: null },
  })

  const existingMap = Object.fromEntries(existingPermissions.map((perm) => [`${perm.method}-${perm.path}`, perm]))
  const routeMap = Object.fromEntries(availableRoutes.map((route) => [`${route.method}-${route.path}`, route]))

  const permissionsToDelete = existingPermissions.filter((perm) => !routeMap[`${perm.method}-${perm.path}`])
  const permissionsToAdd = availableRoutes.filter((route) => !existingMap[`${route.method}-${route.path}`])

  if (permissionsToDelete.length > 0) {
    await prisma.permission.deleteMany({
      where: { id: { in: permissionsToDelete.map((p) => p.id) } },
    })
    console.log(`Deleted ${permissionsToDelete.length} permissions`)
  }

  if (permissionsToAdd.length > 0) {
    await prisma.permission.createMany({
      data: permissionsToAdd,
      skipDuplicates: true,
    })
    console.log(`Added ${permissionsToAdd.length} permissions`)
  }

  const updatedPermissions = await prisma.permission.findMany({
    where: { deletedAt: null },
  })

  const adminPermissions = updatedPermissions.map((p) => ({ id: p.id }))
  const clientPermissions = updatedPermissions.filter((p) => ClientModule.includes(p.module)).map((p) => ({ id: p.id }))

  await Promise.all([
    updateRolePermissions(prisma, RoleName.Admin, adminPermissions),
    updateRolePermissions(prisma, RoleName.Client, clientPermissions),
  ])

  await app.close()
  process.exit(0)
}

const updateRolePermissions = async (prisma: PrismaService, roleName: string, permissions: { id: string }[]) => {
  const role = await prisma.role.findFirstOrThrow({
    where: { name: roleName, deletedAt: null },
  })

  await prisma.role.update({
    where: { id: role.id },
    data: {
      permissions: {
        set: permissions,
      },
    },
  })
}

bootstrap()
