// Importa a biblioteca Express e os tipos necessários para tipar a requisição, a resposta e os erros
import express, { Express, Request, Response, NextFunction } from "express";

// Cria a instância da aplicação Express que representará o servidor web
const app: Express = express();

// Define a porta lógica onde o servidor ficará disponível
const PORT: number = 3000;

// Configura o middleware que permite ao servidor ler o corpo (body) da requisição em formato JSON
app.use(express.json());

// Interface que define os 3 dados esperados no body: nome, idade e timeFavorito
interface MensagemBody {
    nome?: string;
    idade?: number;
    timeFavorito?: string;
}

// Rota POST /mensagem que recebe os 3 dados dinamicamente e retorna a frase montada
app.post("/mensagem", (req: Request<{}, {}, MensagemBody>, res: Response) => {
    try {
        // Recebe os 3 dados enviados pelo cliente no corpo da requisição
        const { nome, idade, timeFavorito } = req.body;

        // Validação 1: Verifica se algum dos 3 campos está vazio ou ausente
        if (!nome || idade === undefined || !timeFavorito) {
            return res.status(400).json({
                erro: "Dados incompletos. Informe nome, idade e timeFavorito no corpo da requisição."
            });
        }

        // Validação 2: Verifica se a idade é um número válido e positivo
        if (typeof idade !== "number" || isNaN(idade) || idade < 0) {
            return res.status(400).json({
                erro: "A idade informada deve ser um número válido e positivo."
            });
        }

        // Monta dinamicamente a frase com os 3 dados recebidos
        const frase: string = `Olá, ${nome}! Você tem ${idade} anos e torce para o ${timeFavorito}!`;

        // Retorna status 200 (OK) e a frase formada em JSON
        return res.status(200).json({
            mensagem: frase
        });

    } catch (error) {
        // Tratamento de erro interno do servidor (Status 500)
        return res.status(500).json({
            erro: "Erro interno no servidor ao processar a mensagem.",
            detalhes: error instanceof Error ? error.message : "Erro desconhecido"
        });
    }
});

// Middleware para capturar erros caso o cliente envie um JSON com sintaxe inválida
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && "body" in err) {
        return res.status(400).json({
            erro: "Formato JSON inválido na requisição."
        });
    }
    next();
});

// Inicia o servidor na porta definida
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});