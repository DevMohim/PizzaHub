export interface ITransaction {
      userId: string | undefined, 
   states ?: 'pending' | 'approved',
   creatAt?: string
}