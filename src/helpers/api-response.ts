export function successResponse(
  data: any,
  mensagem = "Operação realizada com sucesso",
) {
  return {
    sucesso: true,
    mensagem,
    dados: data,
  }
}

export function errorResponse(
  mensagem = "Ocorreu um erro na operação",
  erro: any = null,
) {
  return {
    sucesso: false,
    mensagem,
    erro,
  }
}
