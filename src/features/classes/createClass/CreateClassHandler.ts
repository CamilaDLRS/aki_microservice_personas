export class CreateClassHandler {
  constructor(private readonly repo: IClassRepository = new ClassRepository()) {}
  async execute(input: CreateClassInput) {
    if (!input.name || input.name.length < 2) {
      throw new ApiError(400, 'validation_error', 'Name too short');
    }
    return this.repo.create(input);
  }
}
