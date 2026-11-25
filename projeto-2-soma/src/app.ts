// Importa a biblioteca Express e os tipos necessários para tipar a requisição, a resposta e os erros
import express, { Express, Request, Response, NextFunction } from "express";

// Cria a instância da aplicação Express que representará o servidor web
const app: Express = express();

// Define a porta lógica onde o servidor ficará disponível
const PORT: number = 3000;

// Configura o middleware que permite ao servidor ler o corpo (body) da requisição em formato JSON
app.use(express.json());

// Interface que define os 3 campos esperados no body como 'unknown' (desconhecido),
// permitindo validar se o cliente realmente enviou números ou se enviou textos/vazios por engano
interface SomaBody {
    num1?: unknown;
    num2?: unknown;
    num3?: unknown;
}

// Rota POST /soma que recebe 3 números no body, valida e retorna o resultado da soma
app.post("/soma", (req: Request<{}, {}, SomaBody>, res: Response) => {
    try {
        // Recebe os 3 valores enviados pelo cliente no corpo da requisição
        const { num1, num2, num3 } = req.body;

        // Cria uma lista (array) vazia para acumular todos os problemas encontrados na validação
        const problemas: string[] = [];

        // Validação 1: Verifica se 'num1' foi informado e se é um número válido (não texto e não NaN)
        if (num1 === undefined || typeof num1 !== "number" || isNaN(num1)) {
            problemas.push("O campo 'num1' deve ser preenchido com um valor numérico válido.");
        }

        // Validação 2: Verifica se 'num2' foi informado e se é um número válido
        if (num2 === undefined || typeof num2 !== "number" || isNaN(num2)) {
            problemas.push("O campo 'num2' deve ser preenchido com um valor numérico válido.");
        }

        // Validação 3: Verifica se 'num3' foi informado e se é um número válido
        if (num3 === undefined || typeof num3 !== "number" || isNaN(num3)) {
            problemas.push("O campo 'num3' deve ser preenchido com um valor numérico válido.");
        }

        // Se houver 1 ou mais problemas na lista, interrompe a execução e informa ao cliente (Status 400)
        if (problemas.length > 0) {
            return res.status(400).json({
                erro: "Não foi possível realizar a soma. Verifique os problemas encontrados:",
                problemas: problemas
            });
        }

        // Realiza a soma matemática dinâmica dos 3 números recebidos
        const resultado: number = (num1 as number) + (num2 as number) + (num3 as number);

        // Retorna status 200 (OK) com os números recebidos e o resultado da soma em JSON
        return res.status(200).json({
            numerosRecebidos: [num1, num2, num3],
            soma: resultado
        });

    } catch (error) {
        // Tratamento de erro interno inesperado no servidor (Status 500)
        return res.status(500).json({
            erro: "Erro interno no servidor ao calcular a soma.",
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