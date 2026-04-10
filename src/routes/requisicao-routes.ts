import { Router } from "express"
import { makeCreateRequisicaoController } from "../factories/requisicao/make-create-requisicao.js"
import { makeGetRequisicoesController } from "../factories/requisicao/make-get-requisicoes.js"
import { makeDeleteRequisicaoController } from "../factories/requisicao/make-delete-requisicao.js"
import { makeUpdateRequisicaoController } from "../factories/requisicao/make-update-requisicao.js"

const ReqRouter = Router()

ReqRouter.post("/", (req, res) => {
  const controller = makeCreateRequisicaoController()
  return controller.create(req, res)
})

ReqRouter.get("/", async (req, res) => {
  const controller = makeGetRequisicoesController()
  return controller.handle(req, res)
})

ReqRouter.delete("/:id", (req, res) => {
  const controller = makeDeleteRequisicaoController()
  return controller.handle(req, res)
})

ReqRouter.patch("/:id", (req, res) => {
  const controller = makeUpdateRequisicaoController()
  return controller.handle(req, res)
})

export default ReqRouter