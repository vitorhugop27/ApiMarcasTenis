/**
 * Loja de Tênis - Interface Final (AP2)
 * 
 * Integração 100% com o backend ASP.NET Core via fetch().
 * O backend utiliza Entity Framework Core e banco de dados SQLite.
 */

(function () {
  'use strict';

  const API_URL = '/api/tenis';

  // Estado da aplicação (carregado via backend)
  let catalogo = [];
  let itemSendoEditado = null;
  let ultimoElementoFocado = null;

  // Elementos do DOM
  const form = document.getElementById('tenis-form');
  const formHeading = document.getElementById('form-heading');
  const formModeBadge = document.getElementById('form-mode-badge');
  const inputId = document.getElementById('tenis-id');
  const inputNome = document.getElementById('tenis-nome');
  const inputMarca = document.getElementById('tenis-marca');
  const inputPreco = document.getElementById('tenis-preco');
  const btnSubmit = document.getElementById('btn-submit');
  const btnSubmitText = document.getElementById('btn-submit-text');
  const btnSubmitIcon = document.getElementById('btn-submit-icon');
  const btnCancel = document.getElementById('btn-cancel');
  const btnReset = document.getElementById('btn-reset');

  const errorNome = document.getElementById('nome-error');
  const errorMarca = document.getElementById('marca-error');
  const errorPreco = document.getElementById('preco-error');

  const tenisGrid = document.getElementById('tenis-grid');
  const emptyState = document.getElementById('empty-state');
  const totalItensEl = document.getElementById('total-itens');
  const searchInput = document.getElementById('search-input');
  const btnRestoreData = document.getElementById('btn-restore-data');
  const btnEmptyFocus = document.getElementById('btn-empty-focus');
  const feedbackContainer = document.getElementById('feedback-container');

  // Modal de Detalhes
  const modal = document.getElementById('detail-modal');
  const modalClose = document.getElementById('btn-modal-close');
  const modalDismiss = document.getElementById('btn-modal-dismiss');
  const modalEdit = document.getElementById('btn-modal-edit');
  const detailIdBadge = document.getElementById('detail-id-badge');
  const detailNome = document.getElementById('detail-nome');
  const detailMarca = document.getElementById('detail-marca');
  const detailPreco = document.getElementById('detail-preco');
  let idEmVisualizacao = null;

  // =========================================================================
  // Inicialização
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    configurarEventos();
    carregarCatalogo();
  });

  // =========================================================================
  // Comunicação com o Backend (API Real via fetch)
  // =========================================================================

  async function carregarCatalogo() {
    try {
      totalItensEl.textContent = 'Carregando catálogo...';
      const resposta = await fetch(API_URL);

      if (!resposta.ok) {
        throw new Error(`Erro na API: ${resposta.status} ${resposta.statusText}`);
      }

      catalogo = await resposta.json();
      renderizarCatalogo();
    } catch (erro) {
      console.error('Falha ao carregar tênis da API:', erro);
      totalItensEl.textContent = 'Erro ao carregar';
      exibirFeedback(`Não foi possível carregar o catálogo: ${erro.message}`, 'danger');
    }
  }

  // =========================================================================
  // Configuração de Eventos
  // =========================================================================
  function configurarEventos() {
    // Submissão do Formulário (POST ou PUT)
    form.addEventListener('submit', tratarSubmissaoFormulario);

    // Cancelar Edição
    btnCancel.addEventListener('click', () => {
      cancelarModoEdicao();
      exibirFeedback('Edição cancelada.', 'info');
    });

    // Limpar Formulário
    btnReset.addEventListener('click', () => {
      limparErros();
      if (itemSendoEditado) {
        cancelarModoEdicao();
      }
    });

    // Busca / Filtro em tempo real
    searchInput.addEventListener('input', () => {
      renderizarCatalogo();
    });

    // Botão de recarregar listagem da API
    if (btnRestoreData) {
      btnRestoreData.addEventListener('click', async () => {
        await carregarCatalogo();
        exibirFeedback('Catálogo atualizado a partir do banco de dados.', 'info');
      });
    }

    // Botão de foco quando vazio
    if (btnEmptyFocus) {
      btnEmptyFocus.addEventListener('click', () => {
        inputNome.focus();
      });
    }

    // Fechamento de modal
    modalClose.addEventListener('click', fecharModal);
    modalDismiss.addEventListener('click', fecharModal);
    modalEdit.addEventListener('click', () => {
      if (idEmVisualizacao) {
        const id = idEmVisualizacao;
        fecharModal();
        iniciarEdicao(id);
      }
    });

    // Fechar modal com tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        fecharModal();
      }
    });

    // Limpar erros ao digitar
    inputNome.addEventListener('input', () => limparErroCampo(inputNome, errorNome));
    inputMarca.addEventListener('input', () => limparErroCampo(inputMarca, errorMarca));
    inputPreco.addEventListener('input', () => limparErroCampo(inputPreco, errorPreco));
  }

  // =========================================================================
  // CRUD com Backend (fetch)
  // =========================================================================

  async function tratarSubmissaoFormulario(e) {
    e.preventDefault();

    const dados = {
      nome: inputNome.value.trim(),
      marca: inputMarca.value.trim(),
      preco: parseFloat(inputPreco.value)
    };

    if (!validarFormulario(dados)) {
      return;
    }

    desabilitarBotoesFormulario(true);

    try {
      if (itemSendoEditado) {
        // PUT /api/tenis/{id}
        const resposta = await fetch(`${API_URL}/${itemSendoEditado.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dados)
        });

        if (resposta.status === 404) {
          throw new Error('O tênis selecionado não foi encontrado no banco de dados.');
        }

        if (!resposta.ok) {
          throw new Error(`Erro ao atualizar tênis (Status: ${resposta.status})`);
        }

        const tenisAtualizado = await resposta.json();
        exibirFeedback(`Tênis "${tenisAtualizado.nome}" atualizado com sucesso no banco de dados!`, 'success');
        cancelarModoEdicao();
      } else {
        // POST /api/tenis
        const resposta = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dados)
        });

        if (!resposta.ok) {
          throw new Error(`Erro ao cadastrar tênis (Status: ${resposta.status})`);
        }

        const novoTenis = await resposta.json();
        exibirFeedback(`Tênis "${novoTenis.nome}" cadastrado com sucesso! ID #${novoTenis.id}`, 'success');
        limparFormulario();
      }

      await carregarCatalogo();
    } catch (erro) {
      console.error('Erro na requisição:', erro);
      exibirFeedback(erro.message || 'Falha ao processar a requisição no servidor.', 'danger');
    } finally {
      desabilitarBotoesFormulario(false);
    }
  }

  async function excluirTenis(id) {
    const item = catalogo.find(t => t.id === id);
    const nomeTenis = item ? item.nome : `#${id}`;

    const confirmacao = window.confirm(`Deseja realmente excluir o tênis "${nomeTenis}" do banco de dados?`);
    if (!confirmacao) return;

    if (itemSendoEditado && itemSendoEditado.id === id) {
      cancelarModoEdicao();
    }

    try {
      const resposta = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (resposta.status === 404) {
        throw new Error('O tênis já havia sido removido ou não foi encontrado.');
      }

      if (!resposta.ok && resposta.status !== 204) {
        throw new Error(`Erro ao excluir tênis (Status: ${resposta.status})`);
      }

      exibirFeedback(`Tênis "${nomeTenis}" excluído do banco com sucesso!`, 'danger');
      await carregarCatalogo();
    } catch (erro) {
      console.error('Erro ao excluir:', erro);
      exibirFeedback(erro.message || 'Falha ao excluir o tênis.', 'danger');
    }
  }

  async function abrirModalVisualizacao(id) {
    ultimoElementoFocado = document.activeElement;

    try {
      // Busca dados atualizados da API por ID
      const resposta = await fetch(`${API_URL}/${id}`);
      if (!resposta.ok) {
        throw new Error('Tênis não encontrado no banco.');
      }

      const item = await resposta.json();
      idEmVisualizacao = item.id;

      detailIdBadge.textContent = `ID: #${item.id}`;
      detailNome.textContent = item.nome;
      detailMarca.textContent = item.marca;
      detailPreco.textContent = formatarMoeda(item.preco);

      modal.classList.remove('hidden');
      modalClose.focus();
    } catch (erro) {
      console.error('Erro ao buscar detalhes:', erro);
      exibirFeedback(erro.message || 'Não foi possível carregar os detalhes do item.', 'danger');
    }
  }

  function fecharModal() {
    modal.classList.add('hidden');
    idEmVisualizacao = null;
    if (ultimoElementoFocado) {
      ultimoElementoFocado.focus();
    }
  }

  function iniciarEdicao(id) {
    const item = catalogo.find(t => t.id === id);
    if (!item) return;

    itemSendoEditado = item;
    inputId.value = item.id;
    inputNome.value = item.nome;
    inputMarca.value = item.marca;
    inputPreco.value = item.preco;

    formHeading.textContent = `Editar Tênis (ID #${item.id})`;
    formModeBadge.textContent = 'Modo Edição';
    formModeBadge.classList.add('editing');
    btnSubmitText.textContent = 'Salvar Alterações';
    btnSubmitIcon.textContent = '💾';
    btnCancel.classList.remove('hidden');

    limparErros();
    inputNome.focus();
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function cancelarModoEdicao() {
    itemSendoEditado = null;
    limparFormulario();
    formHeading.textContent = 'Cadastrar Novo Tênis';
    formModeBadge.textContent = 'Novo Registro';
    formModeBadge.classList.remove('editing');
    btnSubmitText.textContent = 'Adicionar Tênis';
    btnSubmitIcon.textContent = '➕';
    btnCancel.classList.add('hidden');
    limparErros();
  }

  function desabilitarBotoesFormulario(desabilitar) {
    btnSubmit.disabled = desabilitar;
    btnCancel.disabled = desabilitar;
    btnReset.disabled = desabilitar;
  }

  // =========================================================================
  // Validação Visual de Campos
  // =========================================================================
  function validarFormulario(dados) {
    let valido = true;
    limparErros();

    if (!dados.nome || dados.nome.length < 2) {
      marcarErro(inputNome, errorNome, 'O nome do tênis deve ter pelo menos 2 caracteres.');
      valido = false;
    }

    if (!dados.marca || dados.marca.length < 2) {
      marcarErro(inputMarca, errorMarca, 'A marca deve ter pelo menos 2 caracteres.');
      valido = false;
    }

    if (isNaN(dados.preco) || dados.preco <= 0) {
      marcarErro(inputPreco, errorPreco, 'Informe um preço válido maior que zero (ex: 499.90).');
      valido = false;
    }

    return valido;
  }

  function marcarErro(input, errorElement, mensagem) {
    input.classList.add('input-error');
    errorElement.textContent = mensagem;
  }

  function limparErroCampo(input, errorElement) {
    input.classList.remove('input-error');
    errorElement.textContent = '';
  }

  function limparErros() {
    limparErroCampo(inputNome, errorNome);
    limparErroCampo(inputMarca, errorMarca);
    limparErroCampo(inputPreco, errorPreco);
  }

  function limparFormulario() {
    form.reset();
    inputId.value = '';
    limparErros();
  }

  // =========================================================================
  // Renderização e Interface
  // =========================================================================
  function renderizarCatalogo() {
    const termoBusca = searchInput.value.toLowerCase().trim();

    const itensFiltrados = catalogo.filter(item => {
      if (!termoBusca) return true;
      return item.nome.toLowerCase().includes(termoBusca) ||
             item.marca.toLowerCase().includes(termoBusca);
    });

    totalItensEl.textContent = `${itensFiltrados.length} ${itensFiltrados.length === 1 ? 'tênis cadastrado' : 'tênis cadastrados'}`;

    if (itensFiltrados.length === 0) {
      tenisGrid.innerHTML = '';
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');
    tenisGrid.innerHTML = '';

    itensFiltrados.forEach(item => {
      const card = document.createElement('article');
      card.className = 'tenis-card';
      card.setAttribute('aria-label', `Tênis ${item.nome}`);

      card.innerHTML = `
        <div>
          <div class="tenis-card-header">
            <span class="badge-id">ID #${item.id}</span>
            <span class="badge-marca">${sanitizarTexto(item.marca)}</span>
          </div>
          <h3 class="tenis-card-title">${sanitizarTexto(item.nome)}</h3>
        </div>
        <div>
          <div class="tenis-card-price">${formatarMoeda(item.preco)}</div>
          <div class="tenis-card-actions">
            <button type="button" class="btn btn-sm btn-action-view" data-action="view" data-id="${item.id}" title="Visualizar detalhes de ${sanitizarTexto(item.nome)}">
              <span aria-hidden="true">👁️</span> Ver
            </button>
            <button type="button" class="btn btn-sm btn-action-edit" data-action="edit" data-id="${item.id}" title="Editar ${sanitizarTexto(item.nome)}">
              <span aria-hidden="true">✏️</span> Editar
            </button>
            <button type="button" class="btn btn-sm btn-action-delete" data-action="delete" data-id="${item.id}" title="Excluir ${sanitizarTexto(item.nome)}">
              <span aria-hidden="true">🗑️</span> Excluir
            </button>
          </div>
        </div>
      `;

      tenisGrid.appendChild(card);
    });

    adicionarEventosGrid();
  }

  function adicionarEventosGrid() {
    const viewButtons = tenisGrid.querySelectorAll('[data-action="view"]');
    const editButtons = tenisGrid.querySelectorAll('[data-action="edit"]');
    const deleteButtons = tenisGrid.querySelectorAll('[data-action="delete"]');

    viewButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        abrirModalVisualizacao(id);
      });
    });

    editButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        iniciarEdicao(id);
      });
    });

    deleteButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'), 10);
        excluirTenis(id);
      });
    });
  }

  // =========================================================================
  // Utilitários de Apresentação e Feedback
  // =========================================================================
  function exibirFeedback(mensagem, tipo = 'info') {
    feedbackContainer.innerHTML = '';

    const alert = document.createElement('div');
    alert.className = `alert alert-${tipo}`;

    let icone = 'ℹ️';
    if (tipo === 'success') icone = '✅';
    if (tipo === 'danger') icone = '🗑️';

    alert.innerHTML = `
      <span><strong>${icone}</strong> ${sanitizarTexto(mensagem)}</span>
      <button type="button" class="alert-close" aria-label="Fechar notificação">&times;</button>
    `;

    const closeBtn = alert.querySelector('.alert-close');
    closeBtn.addEventListener('click', () => {
      alert.remove();
    });

    feedbackContainer.appendChild(alert);

    setTimeout(() => {
      if (alert.parentElement) {
        alert.remove();
      }
    }, 5000);
  }

  function formatarMoeda(valor) {
    if (typeof valor !== 'number' || isNaN(valor)) return 'R$ 0,00';
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function sanitizarTexto(texto) {
    const div = document.createElement('div');
    div.textContent = texto || '';
    return div.innerHTML;
  }

})();
