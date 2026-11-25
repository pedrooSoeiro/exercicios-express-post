// Importa a biblioteca Express e os tipos necessários
import express, { Express, Request, Response, NextFunction } from "express";

// Importa o módulo nativo 'fs' para ler o arquivo JSON
import fs from "fs";

// Importa o módulo nativo 'path' para montar o caminho até o arquivo JSON
import path from "path";

// Cria a instância da aplicação Express
const app: Express = express();

// Define a porta do servidor
const PORT: number = 3000;

// Habilita a leitura do corpo da requisição em JSON
app.use(express.json());

// Interface dos dados enviados pelo cliente na requisição
interface LoginBody {
    usuario?: string;
    senha?: string;
}

// Interface da estrutura de cada usuário no arquivo usuarios.json
interface UsuarioCadastrado {
    usuario: string;
    senha: string;
}

// Rota POST /login
app.post("/login", (req: Request<{}, {}, LoginBody>, res: Response) => {
    try {
        const { usuario, senha } = req.body;

        // Validação 1: Verifica se usuário e senha foram informados
        if (!usuario || !senha) {
            return res.status(400).json({
                erro: "Dados incompletos. Informe 'usuario' e 'senha' no corpo da requisição."
            });
        }

        // Monta o caminho a partir da pasta raiz onde o npm run dev:p3 é executado
        const caminhoArquivo: string = path.join(
            process.cwd(),
            "projeto-3-login",
            "src",
            "usuarios.json"
        );

        // Lê e converte o conteúdo do arquivo usuarios.json
        const dadosBrutos: string = fs.readFileSync(caminhoArquivo, "utf-8");
        const listaUsuarios: UsuarioCadastrado[] = JSON.parse(dadosBrutos);

        // Procura o usuário e verifica se a senha está correta
        const usuarioValido = listaUsuarios.find(
            (item) => item.usuario === usuario && item.senha === String(senha)
        );

        // Se os dados estiverem incorretos, retorna erro 401 em JSON
        if (!usuarioValido) {
            return res.status(401).json({
                erro: "Usuário ou senha incorretos. Acesso não autorizado."
            });
        }

        // Se estiver tudo certo, retorna status 200
        return res.status(200).json({
            mensagem: `Login realizado com sucesso! Bem-vindo, ${usuarioValido.usuario}.`
        });

    } catch (error) {
        return res.status(500).json({
            erro: "Erro interno no servidor ao validar o login.",
            detalhes: error instanceof Error ? error.message : "Erro desconhecido"
        });
    }
});

// Middleware para erros de sintaxe no JSON
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && "body" in err) {
        return res.status(400).json({
            erro: "Formato JSON inválido na requisição."
        });
    }
    next();
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});