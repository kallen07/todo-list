export type Task = {
  id: string,
  text: string,
  isDone: boolean,
  dateCreated: Date,
  dateCompleted: Date | null,
}
