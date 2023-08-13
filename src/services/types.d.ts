export interface IUserData {
  id: number
  fullName?: string
  username: string
  password: string
  avatar?: string
  email: string
  role: string
  abilities: UserAbility[]
}
