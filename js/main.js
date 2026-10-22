/* ==========================================================================
   Centro Educacional Sonho Meu
   - navegação de tela única (uma página do caderno por vez, com endereço #hash)
   - marcador do menu que desliza até o item atual
   - mapa da estrutura, rotina com o sol e formulário que abre o WhatsApp
   ========================================================================== */

/* Troque aqui o número do WhatsApp da secretaria (DDI + DDD + número, só dígitos). */
const WHATSAPP = '85987715486';
const WHATSAPP_LEGIVEL = '(85) 98771-5486';
const NOME_ESCOLA = 'Centro Educacional Sonho Meu';

(() => {
  const raiz = document.documentElement;
  const paineis = Array.from(document.querySelectorAll('.painel'));
  const ids = paineis.map((p) => p.id);
  const links = Array.from(document.querySelectorAll('.menu__link'));
  const lista = document.querySelector('.menu__lista');
  const marcador = document.querySelector('.menu__marcador');
  const menuCard = document.querySelector('.menu-card');
  const folha = document.querySelector('.folha');

  const mq = (q) => window.matchMedia(q).matches;
  const reduzido = () => mq('(prefers-reduced-motion: reduce)');
  const telaUnica = () => mq('(min-width: 960px) and (min-height: 600px)');

  let atual = null;

  /* ---------------- Navegação entre páginas ---------------- */
  function painelDoEndereco() {
    const id = decodeURIComponent(window.location.hash.replace('#', ''));
    return ids.includes(id) ? id : 'inicio';
  }

  function linkDe(id) {
    return links.find((a) => a.getAttribute('href') === '#' + id);
  }

  function ativar(id, { focar = false, primeira = false } = {}) {
    if (id === atual) return;
    const novo = document.getElementById(id);
    const velho = atual ? document.getElementById(atual) : null;
    const animar = !primeira && !reduzido();

    if (velho) {
      velho.classList.remove('ativo', 'entrando');
      if (animar && telaUnica()) {
        velho.classList.add('saindo');
        window.setTimeout(() => velho.classList.remove('saindo'), 170);
      }
    }

    novo.classList.add('ativo');
    novo.classList.remove('entrando');
    if (animar) {
      void novo.offsetWidth; // reinicia a animação
      novo.classList.add('entrando');
    }
    novo.scrollTop = 0;
    atual = id;

    links.forEach((a) => {
      if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    moverMarcador(!primeira);
    centralizarNoMenu(!primeira);

    const nome = linkDe(id)?.textContent.trim();
    document.title = id === 'inicio' ? NOME_ESCOLA : `${nome} | ${NOME_ESCOLA}`;

    if (focar) {
      const titulo = novo.querySelector('h2');
      if (titulo) titulo.focus({ preventScroll: true });
      if (!telaUnica()) rolarAteAFolha();
    }
  }

  // Cliques em qualquer link interno que aponte para uma página (#inicio, #contato...)
  document.addEventListener('click', (evento) => {
    const a = evento.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    if (id === 'conteudo') {
      // "Pular para o conteúdo": leva o foco ao título da página aberta
      evento.preventDefault();
      const titulo = document.getElementById(atual)?.querySelector('h2');
      (titulo || folha).focus();
      return;
    }
    if (!ids.includes(id)) return;
    evento.preventDefault();
    if (id !== atual) window.history.pushState({ id }, '', '#' + id);
    ativar(id, { focar: true });
  });

  // Voltar/avançar do navegador. Âncoras que não são páginas (como o "Pular para o conteúdo") são ignoradas.
  function aoMudarEndereco() {
    const id = decodeURIComponent(window.location.hash.replace('#', ''));
    if (id === '') ativar('inicio', { focar: true });
    else if (ids.includes(id)) ativar(id, { focar: true });
  }
  window.addEventListener('popstate', aoMudarEndereco);
  window.addEventListener('hashchange', aoMudarEndereco);

  function rolarAteAFolha() {
    const topoFolha = folha.getBoundingClientRect().top;
    const folga = (menuCard?.offsetHeight || 0) + 20;
    if (topoFolha < folga || topoFolha > window.innerHeight * 0.6) {
      window.scrollTo({
        top: window.scrollY + topoFolha - folga,
        behavior: reduzido() ? 'auto' : 'smooth',
      });
    }
  }

  /* ---------------- Marcador do menu ---------------- */
  function moverMarcador(animar = true) {
    if (!marcador) return;
    const ativo = links.find((a) => a.getAttribute('aria-current') === 'page');
    if (!ativo) return;
    if (!animar) marcador.style.transition = 'none';
    marcador.style.setProperty('--y', ativo.offsetTop + 'px');
    marcador.style.setProperty('--h', ativo.offsetHeight + 'px');
    if (!animar) {
      void marcador.offsetWidth;
      marcador.style.transition = '';
    }
    marcador.classList.add('pronto');
  }

  // No celular o menu é uma faixa horizontal: mantém o item atual à vista
  function centralizarNoMenu(animar = true) {
    if (!lista || lista.scrollWidth <= lista.clientWidth) return;
    const ativo = links.find((a) => a.getAttribute('aria-current') === 'page');
    if (!ativo) return;
    const item = ativo.parentElement;
    lista.scrollTo({
      left: item.offsetLeft - (lista.clientWidth - item.offsetWidth) / 2,
      behavior: animar && !reduzido() ? 'smooth' : 'auto',
    });
  }

  let espera;
  window.addEventListener('resize', () => {
    window.clearTimeout(espera);
    espera = window.setTimeout(() => {
      moverMarcador(false);
      centralizarNoMenu(false);
    }, 120);
  });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => moverMarcador(false));
  }

  /* ---------------- Título "escrito à mão" na primeira visita ---------------- */
  function escrever(titulo) {
    if (!titulo || reduzido()) return;
    const texto = titulo.textContent.trim();
    titulo.setAttribute('aria-label', texto);
    titulo.textContent = '';
    texto.split(/\s+/).forEach((palavra, i, todas) => {
      const span = document.createElement('span');
      span.className = 'palavra';
      span.setAttribute('aria-hidden', 'true');
      span.style.setProperty('--i', i);
      span.textContent = palavra;
      titulo.append(span);
      if (i < todas.length - 1) titulo.append(' ');
    });
  }

  /* ---------------- Estrutura: lista + mapa ---------------- */
  const botoesLugar = Array.from(document.querySelectorAll('.lugar'));
  const detalheLugar = document.querySelector('.lugar-detalhe');
  const mapa = document.querySelector('.mapa');

  function escolherLugar(nome) {
    const botao = botoesLugar.find((b) => b.dataset.lugar === nome);
    if (!botao) return;
    botoesLugar.forEach((b) => b.setAttribute('aria-pressed', String(b === botao)));
    if (detalheLugar) {
      const forte = document.createElement('strong');
      forte.textContent = botao.textContent.trim() + '.';
      detalheLugar.replaceChildren(forte, ' ' + botao.dataset.texto);
    }
    if (mapa) {
      mapa.querySelectorAll('.lugar-mapa').forEach((g) => {
        g.classList.toggle('ativo', g.dataset.lugar === nome);
      });
    }
  }
  botoesLugar.forEach((b) => b.addEventListener('click', () => escolherLugar(b.dataset.lugar)));
  if (mapa) {
    mapa.addEventListener('click', (evento) => {
      const lugar = evento.target.closest('.lugar-mapa');
      if (lugar) escolherLugar(lugar.dataset.lugar);
    });
  }

  /* ---------------- Rotina: o sol acompanha o dia ---------------- */
  const dia = document.querySelector('.dia');
  const momentos = Array.from(document.querySelectorAll('.momento'));
  const detalhe = {
    hora: document.querySelector('.momento-detalhe__hora'),
    titulo: document.querySelector('.momento-detalhe__titulo'),
    texto: document.querySelector('.momento-detalhe__texto'),
    tag: document.querySelector('.momento-detalhe__tag'),
  };
  let indiceMomento = 0;

  const partes = (botao) => ({
    hora: botao.querySelector('.momento__hora').textContent.trim(),
    titulo: botao.querySelector('.momento__titulo').textContent.trim(),
    texto: botao.querySelector('.momento__texto').textContent.trim(),
  });

  momentos.forEach((botao, i) => {
    const { hora, titulo } = partes(botao);
    botao.setAttribute('aria-label', `${hora}, ${titulo}`);
    botao.addEventListener('click', () => escolherMomento(i));
  });

  function escolherMomento(i) {
    if (!dia || !momentos.length) return;
    indiceMomento = (i + momentos.length) % momentos.length;
    const botao = momentos[indiceMomento];
    momentos.forEach((m, j) => m.setAttribute('aria-pressed', String(j === indiceMomento)));
    const angulo = botao.parentElement.style.getPropertyValue('--a').trim();
    dia.style.setProperty('--ang', angulo);
    dia.dataset.periodo = botao.dataset.periodo;
    const { hora, titulo, texto } = partes(botao);
    detalhe.hora.textContent = hora;
    detalhe.titulo.textContent = titulo;
    detalhe.texto.textContent = texto;
    detalhe.tag.hidden = !botao.hasAttribute('data-integral');
  }

  document.querySelectorAll('[data-passo]').forEach((b) => {
    b.addEventListener('click', () => escolherMomento(indiceMomento + Number(b.dataset.passo)));
  });

  /* ---------------- Seletor no tema da escola ----------------
     Troca a lista padrão do navegador por uma lista de papel. O <select> original
     continua no formulário (escondido) e recebe o valor, então a validação não muda. */
  function seletorDaEscola(select) {
    const id = select.id;
    const rotulo = document.querySelector(`label[for="${id}"]`);
    const opcoes = Array.from(select.options).filter((o) => o.value !== '');
    const textoVazio = select.options[0]?.value === '' ? select.options[0].textContent : '';

    const caixa = document.createElement('div');
    caixa.className = 'seletor';
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'seletor__botao';
    botao.id = id + '-botao';
    botao.setAttribute('aria-haspopup', 'listbox');
    botao.setAttribute('aria-expanded', 'false');
    const valor = document.createElement('span');
    valor.className = 'seletor__valor';
    botao.append(valor);
    if (rotulo) {
      rotulo.id = rotulo.id || id + '-rotulo';
      rotulo.htmlFor = botao.id;
      botao.setAttribute('aria-labelledby', `${rotulo.id} ${botao.id}`);
    }
    if (select.hasAttribute('aria-describedby')) {
      botao.setAttribute('aria-describedby', select.getAttribute('aria-describedby'));
    }

    const lista = document.createElement('ul');
    lista.className = 'seletor__lista';
    lista.id = id + '-lista';
    lista.setAttribute('role', 'listbox');
    lista.tabIndex = -1;
    if (rotulo) lista.setAttribute('aria-labelledby', rotulo.id);
    lista.hidden = true;
    botao.setAttribute('aria-controls', lista.id);

    const itens = opcoes.map((opcao, i) => {
      const li = document.createElement('li');
      li.id = `${id}-op-${i}`;
      li.className = 'seletor__opcao';
      li.setAttribute('role', 'option');
      li.textContent = opcao.textContent;
      li.addEventListener('mousedown', (e) => e.preventDefault()); // mantém o foco na lista
      li.addEventListener('click', () => escolher(i));
      li.addEventListener('mousemove', () => destacar(i));
      lista.append(li);
      return li;
    });

    caixa.append(botao, lista);
    select.after(caixa);
    select.classList.add('seletor__nativo');
    select.tabIndex = -1;
    select.setAttribute('aria-hidden', 'true');

    let destaque = -1;
    const indiceAtual = () => opcoes.findIndex((o) => o.value === select.value);

    function mostrarValor() {
      const i = indiceAtual();
      valor.textContent = i >= 0 ? opcoes[i].textContent : textoVazio;
      botao.classList.toggle('seletor__botao--vazio', i < 0);
      itens.forEach((li, j) => li.setAttribute('aria-selected', String(j === i)));
    }
    function destacar(i) {
      destaque = Math.max(0, Math.min(itens.length - 1, i));
      itens.forEach((li, j) => li.classList.toggle('ativo', j === destaque));
      lista.setAttribute('aria-activedescendant', itens[destaque].id);
      const li = itens[destaque];
      if (li.offsetTop < lista.scrollTop) lista.scrollTop = li.offsetTop;
      else if (li.offsetTop + li.offsetHeight > lista.scrollTop + lista.clientHeight) {
        lista.scrollTop = li.offsetTop + li.offsetHeight - lista.clientHeight;
      }
    }
    function abrir() {
      if (!lista.hidden) return;
      lista.hidden = false;
      botao.setAttribute('aria-expanded', 'true');
      caixa.classList.add('aberto');
      destacar(Math.max(0, indiceAtual()));
      lista.focus();
    }
    function fechar(devolverFoco = true) {
      if (lista.hidden) return;
      lista.hidden = true;
      botao.setAttribute('aria-expanded', 'false');
      caixa.classList.remove('aberto');
      lista.removeAttribute('aria-activedescendant');
      if (devolverFoco) botao.focus();
    }
    function escolher(i) {
      select.value = opcoes[i].value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      mostrarValor();
      fechar();
    }

    botao.addEventListener('click', () => (lista.hidden ? abrir() : fechar()));
    botao.addEventListener('keydown', (e) => {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        abrir();
      }
    });
    lista.addEventListener('keydown', (e) => {
      const passos = { ArrowDown: 1, ArrowUp: -1 };
      if (e.key in passos) { e.preventDefault(); destacar(destaque + passos[e.key]); }
      else if (e.key === 'Home') { e.preventDefault(); destacar(0); }
      else if (e.key === 'End') { e.preventDefault(); destacar(itens.length - 1); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); escolher(destaque); }
      else if (e.key === 'Escape') { e.preventDefault(); fechar(); }
      else if (e.key === 'Tab') fechar(false);
      else if (e.key.length === 1) {
        // digitar a primeira letra pula para a opção correspondente
        const letra = e.key.toLowerCase();
        const achou = itens.findIndex((li, j) => j > destaque && li.textContent.trim().toLowerCase().startsWith(letra));
        const volta = itens.findIndex((li) => li.textContent.trim().toLowerCase().startsWith(letra));
        if (achou >= 0 || volta >= 0) destacar(achou >= 0 ? achou : volta);
      }
    });
    lista.addEventListener('blur', (e) => {
      if (!caixa.contains(e.relatedTarget)) fechar(false);
    });
    document.addEventListener('pointerdown', (e) => {
      if (!caixa.contains(e.target)) fechar(false);
    });

    // o erro marcado no <select> aparece também no botão
    new MutationObserver(() => {
      const invalido = select.getAttribute('aria-invalid');
      if (invalido) botao.setAttribute('aria-invalid', invalido);
    }).observe(select, { attributes: true, attributeFilter: ['aria-invalid'] });

    select.addEventListener('change', mostrarValor);
    mostrarValor();
    return { botao };
  }

  /* ---------------- Formulário: agenda pelo WhatsApp ---------------- */
  const ficha = document.querySelector('.ficha');
  if (ficha) {
    const campoNome = ficha.querySelector('#f-nome');
    const campoIdade = ficha.querySelector('#f-idade');
    const ajuda = ficha.querySelector('.ficha__ajuda');
    const seletorIdade = seletorDaEscola(campoIdade);

    const marcarErro = (campo, comErro) => {
      const erro = document.getElementById(campo.getAttribute('aria-describedby'));
      campo.setAttribute('aria-invalid', String(comErro));
      if (erro) erro.hidden = !comErro;
    };

    [campoNome, campoIdade].forEach((campo) => {
      campo.addEventListener('input', () => {
        if (campo.getAttribute('aria-invalid') === 'true' && campo.value.trim()) marcarErro(campo, false);
      });
      campo.addEventListener('change', () => {
        if (campo.getAttribute('aria-invalid') === 'true' && campo.value.trim()) marcarErro(campo, false);
      });
    });

    ficha.addEventListener('submit', (evento) => {
      evento.preventDefault();
      const nome = campoNome.value.trim();
      const idade = campoIdade.value;
      const periodo = ficha.querySelector('input[name="periodo"]:checked')?.value || 'manhã';

      marcarErro(campoNome, !nome);
      marcarErro(campoIdade, !idade);
      if (!nome) { campoNome.focus(); return; }
      if (!idade) { seletorIdade.botao.focus(); return; }

      const mensagem =
        `Olá! Meu nome é ${nome} e gostaria de agendar uma visita ao ${NOME_ESCOLA}. ` +
        `Minha criança tem ${idade}. Prefiro visitar no período da ${periodo}.`;
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`, '_blank', 'noopener');
      ajuda.textContent = `Abrimos o WhatsApp em uma nova aba. Se não abriu, chame no ${WHATSAPP_LEGIVEL}.`;
    });
  }

  /* ---------------- Início ---------------- */
  paineis.forEach((p) => p.classList.remove('ativo'));
  const inicial = painelDoEndereco();
  ativar(inicial, { primeira: true });
  escrever(document.getElementById(inicial)?.querySelector('h2'));
  escolherLugar('salas');
  escolherMomento(0);
  raiz.classList.add('pronto');
})();
