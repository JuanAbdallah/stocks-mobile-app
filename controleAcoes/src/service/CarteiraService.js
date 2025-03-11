const API_URL = 'http://44.196.244.82:8080/acoes'; 
// const API_URL = 'http://192.168.100.2:8080/acoes'; 

export const comprarAcao = async ( nome, valor, quantidade, usuarioId, simbolo) => {
    const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nome,
            valor,
            quantidade,
            usuarioId,
            simbolo
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao comprar ação');
    }

    return await response.json();
};

export const buscarAcoesDoUsuario = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao buscar as ações.');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Erro ao buscar as ações com fetch:', error.message);
        throw new Error(error.message || 'Erro ao buscar as ações.');
    }
};

export const atualizarAcao = async (id, dadosAcao) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosAcao),
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar a ação');
        }

        const data = await response.json(); 
        return data; 
    } catch (error) {
        throw new Error(error.message || 'Erro ao atualizar a ação');
    }
};

export const excluirAcao = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro ao excluir a ação com ID ${id}`);
        }

        return { message: "Ação excluída com sucesso!" };
    } catch (error) {
        throw new Error(error.message || `Erro ao excluir a ação com ID ${id}`);
    }
};