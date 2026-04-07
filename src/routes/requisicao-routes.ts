import { Router } from "express"
import { makeCreateRequisicaoController } from "../factories/requisicao/make-create-requisicao.js"

const ReqRouter = Router()

const controller = makeCreateRequisicaoController()

ReqRouter.post("/", (req, res) => controller.create(req, res))

export default ReqRouter