const URL_USER = "http://44.196.244.82:8080";
// const URL_USER = "http://192.168.100.2:8080";

const SaveUser = async (userObject) => {
    if (!userObject.nomeUsuario) {
        throw new Error("nome vazio");
    }
    if (!userObject.email) {
        throw new Error("email vazio");
    }
    if (!userObject.senha) {
        throw new Error("senha vazia");
    }

    const dados = {
        nomeUsuario: userObject.nomeUsuario,
        email: userObject.email,
        senha: userObject.senha,
        saldo: 0,
        avaliacao: 0 
    };

    const response = await fetch(`${URL_USER}/user/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados), 
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao cadastrar usuário: ${errorText}`);
    }

    const user = await response.json();
    return user;
};

const LoginUser = async (email, senha) => {
    if (!email) {
        throw new Error("Email vazio");
    }
    if (!senha) {
        throw new Error("Senha vazia");
    }

    const dados = {
        email: email,
        senha: senha,
    };

    const response = await fetch(`${URL_USER}/user/login`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao fazer login: ${errorText}`);
    }

    const userData = await response.json();
    return userData;
};

const depositarSaldo = async (userId, valor, token) => {
    if (!userId) {
        throw new Error("ID do usuário vazio");
    }
    if (valor <= 0) {
        throw new Error("O valor para depósito deve ser positivo");
    }

    const dados = { valor };

    const response = await fetch(`${URL_USER}/user/${userId}/depositar`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(dados),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao depositar saldo: ${errorText}`);
    }

    const result = await response.json();
    return result;
};

const retirarSaldo = async (userId, valor, token) => {
    if (!userId) {
        throw new Error("ID do usuário vazio");
    }
    if (valor <= 0) {
        throw new Error("O valor para retirada deve ser positivo");
    }

    const dados = { valor };

    const response = await fetch(`${URL_USER}/user/${userId}/retirar`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(dados),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao retirar saldo: ${errorText}`);
    }

    const result = await response.json();
    return result;
};

const AtualizarUsuario = async (userId, user, token) => {
    if (!userId) {
        throw new Error("ID do usuário vazio");
    }
    if (!user || Object.keys(user).length === 0) {
        throw new Error("Dados de atualização vazios");
    }

    const response = await fetch(`${URL_USER}/user/${userId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(user),
    });

    const responseText = await response.text(); 
    console.log('Resposta do servidor:', responseText);

    if (!response.ok) {
        throw new Error(`Erro ao atualizar usuário: ${responseText}`);
    }

    const updatedUser = JSON.parse(responseText);
    return updatedUser;
};



export { SaveUser, LoginUser, depositarSaldo, retirarSaldo, AtualizarUsuario };
