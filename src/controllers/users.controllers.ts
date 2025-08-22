class UserController {
  register(req: Request, res: Response) {
    console.log(req, res)
  }
}

export default new UserController()
