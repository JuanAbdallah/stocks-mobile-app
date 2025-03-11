const API_URL = "http://44.196.244.82:8080";
// const API_URL = "http://192.168.100.2:8080";

export const registrarHistorico = async (nome, valor, quantidade, simbolo, usuarioId, status) => {
    try {
        const response = await fetch(`${API_URL}/historico`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome,
                valor,
                quantidade,
                simbolo,
                usuarioId,
                status, 
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao registrar histórico');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao registrar histórico:', error);
        throw error;
    }
};


export const buscarHistoricoDoUsuario = async (usuarioId) => {
    try {
        const response = await fetch(`${API_URL}/historico/${usuarioId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao buscar histórico do usuário');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar histórico do usuário:', error);
        throw error;
    }
};

