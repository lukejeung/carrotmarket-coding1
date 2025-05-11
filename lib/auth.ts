import { db } from './db'
import { compare, hash } from 'bcrypt'
import { getServerSession } from 'next-auth'
import { authOptions } from './session'

interface LoginInput {
  email: string
  password: string
}

interface RegisterInput {
  email: string
  password: string
  username: string
}

export async function loginUser({ email, password }: LoginInput) {
  const user = await db.user.findUnique({ where: { email } })
  if (!user) throw new Error('존재하지 않는 사용자입니다.')

  const isValid = await compare(password, user.password)
  if (!isValid) throw new Error('비밀번호가 올바르지 않습니다.')

  return { message: '로그인 성공', userId: user.user_no }
}

export async function registerUser({ email, password, username }: RegisterInput) {
  const existing = await db.user.findUnique({ where: { email } })
  if (existing) throw new Error('이미 존재하는 이메일입니다.')

  const hashed = await hash(password, 10)
  const newUser = await db.user.create({
    data: {
      email,
      password: hashed,
      username,
    },
  })

  return { message: '회원가입 성공', userId: newUser.user_no }
}
