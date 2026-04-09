import { Router } from "express"
import { makeCreateRequisicaoController } from "../factories/requisicao/make-create-requisicao.js"
import { makeGetRequisicoesController } from "../factories/requisicao/make-get-requisicoes.js"

const ReqRouter = Router()

ReqRouter.post("/", (req, res) => {
  const controller = makeCreateRequisicaoController()
  return controller.create(req, res)
})

ReqRouter.get("/", async (req, res) => {
  const controller = makeGetRequisicoesController()
  return controller.handle(req, res)
})

export default ReqRouter