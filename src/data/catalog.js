// Cada plano preserva sua própria data. A constante exportada indica a revisão mais recente.
const INITIAL_VERIFIED_AT = '2026-11-20';
export const VERIFIED_AT = '2026-11-22';
export const FAVORITES_KEY = 'revista-campus:prototype:favorites:v1';
export const OFFER_KINDS = {
  free: { label: 'Gratuito', hint: 'Benefício sem mensalidade para quem se qualifica' },
  trial: { label: 'Teste grátis', hint: 'Período limitado; pode haver cobrança depois' },
  discount: { label: 'Preço estudantil', hint: 'Assinatura paga com condição para estudantes' },
};
const source = (label, url) => ({ label, url });
const googleHelp = source('Ofertas Google One para estudantes', 'https://support.google.com/googleone/answer/17422238?hl=pt-BR');
const googleStudents = 'https://one.google.com/ai-student';

export const SERVICES = [
  {
    id: 'github', name: 'GitHub', subtitle: 'Código e ferramentas para seus projetos',
    topics: ['estudo', 'criatividade'], tone: 'sage', image: 'campus.png',
    imageAlt: 'Ilustração de um campus entre árvores e caminhos.',
    description: 'Hospede código, colabore em projetos e explore ferramentas de desenvolvimento.',
    keywords: 'programação desenvolvedor education software tecnologia',
    offers: [{
      id: 'github-student-developer-pack', title: 'Student Developer Pack', kind: 'free', scope: 'student',
      summary: 'GitHub Pro sem mensalidade enquanto você for estudante, além de ofertas de parceiros com condições próprias.',
      price: 'Grátis para estudantes aprovados',
      eligibility: 'Estudantes a partir de 13 anos, matriculados em curso que conceda diploma ou graduação, com conta pessoal e vínculo comprovado no GitHub.',
      renewal: 'O acesso depende de manter a qualificação estudantil. Cada parceiro do Pack define seus limites e prazos; não inclui todos os planos de cada serviço.',
      steps: ['Entre na sua conta pessoal do GitHub e solicite os benefícios Education.', 'Comprove seu vínculo no fluxo do GitHub e aguarde a aprovação.', 'Acesse o Pack e confira os termos de cada ferramenta antes de ativar.'],
      officialUrl: 'https://education.github.com/pack', verifiedAt: INITIAL_VERIFIED_AT,
      sources: [source('GitHub Student Developer Pack', 'https://education.github.com/pack'), source('Requisitos do GitHub Education', 'https://docs.github.com/pt/education/about-github-education/github-education-for-students/apply-to-github-education-as-a-student')],
    }],
  },
  {
    id: 'google', name: 'Google', subtitle: 'AI Plus, AI Pro e pacote com YouTube',
    topics: ['estudo', 'criatividade'], tone: 'ochre', image: 'campus.png',
    imageAlt: 'Ilustração de um campus universitário ao ar livre.',
    description: 'Compare o teste do AI Plus com as assinaturas estudantis do AI Pro, com ou sem YouTube Premium.',
    keywords: 'google one gemini inteligência artificial armazenamento',
    offers: [
      {
        id: 'google-ai-plus-student', title: 'Google AI Plus', kind: 'trial', scope: 'student',
        summary: '12 meses sem mensalidade para universitários elegíveis no Brasil, com 400 GB de armazenamento e acesso ampliado ao Gemini.',
        price: '12 meses grátis', renewalPrice: { amount: 24.99, currency: 'BRL', interval: 'month' },
        eligibility: '18 anos ou mais, ensino superior elegível, conta Google pessoal, verificação pela SheerID e forma de pagamento válida. Contas de grupos familiares e certas assinaturas de terceiros têm restrições.',
        renewal: 'Depois dos 12 meses, cobrança automática de R$ 24,99/mês, salvo cancelamento antes do fim do teste. Confirme o valor e a data no resgate.',
        redeemBy: '2026-12-31',
        steps: ['Abra a página de estudantes com sua conta Google pessoal.', 'Escolha o AI Plus e conclua a verificação SheerID.', 'Confira os termos, cadastre o pagamento e anote a data de renovação.'],
        officialUrl: 'https://gemini.google/br/students/', verifiedAt: INITIAL_VERIFIED_AT,
        sources: [source('Gemini para estudantes no Brasil', 'https://gemini.google/br/students/'), source('Termos do teste estudantil', 'https://one.google.com/offer/studentoffer8?g1_landing_page=0'), googleHelp],
      },
      {
        id: 'google-ai-pro-student', title: 'Google AI Pro', kind: 'discount', scope: 'student',
        summary: 'Assinatura paga com desconto estudantil por até quatro anos consecutivos, enquanto você mantiver a matrícula e a qualificação.',
        price: 'Preço estudantil exibido na sua conta',
        eligibility: 'Ensino superior elegível no Brasil, conta Google pessoal, aprovação pela SheerID e pagamento aceito. A disponibilidade depende da sua conta.',
        renewal: 'Exige reverificação estudantil. Sem revalidação ou ao fim da condição especial, pode haver cobrança do preço padrão. O valor não foi confirmado fora da conta; confira antes de assinar.',
        steps: ['Abra as ofertas Google One para estudantes.', 'Escolha o AI Pro e confirme matrícula e elegibilidade pela SheerID.', 'Confira o preço, a cobrança recorrente e as condições de reverificação.'],
        officialUrl: googleStudents, verifiedAt: INITIAL_VERIFIED_AT, sources: [googleHelp],
      },
      {
        id: 'google-ai-pro-youtube-student', title: 'AI Pro + YouTube Premium', kind: 'discount', scope: 'student',
        summary: 'Pacote estudantil pago com Google AI Pro e YouTube Premium, disponível no Brasil por até quatro anos consecutivos enquanto elegível.',
        price: 'Preço do pacote exibido na sua conta',
        eligibility: 'Ensino superior elegível em país atendido pelos dois serviços, incluindo Brasil; conta pessoal, pagamento válido e verificação SheerID.',
        renewal: 'Sujeito à reverificação estudantil e às condições do pacote. Se já assina YouTube, confira possíveis cobranças duplicadas. O preço depende da oferta apresentada à sua conta.',
        steps: ['Abra as ofertas estudantis no Google One.', 'Selecione o pacote com YouTube Premium e faça a verificação.', 'Revise assinaturas existentes e o preço recorrente antes de confirmar.'],
        officialUrl: googleStudents, verifiedAt: INITIAL_VERIFIED_AT, sources: [googleHelp],
      },
    ],
  },
  {
    id: 'notion', name: 'Notion', subtitle: 'Um espaço para notas, estudos e rotina',
    topics: ['estudo', 'bem-estar'], tone: 'paper', image: 'category-wellbeing-v2.png',
    imageAlt: 'Ilustração de um canto de leitura com poltrona, caderno e janela.',
    description: 'Organize aulas, anotações e projetos em um espaço de trabalho individual.',
    keywords: 'education plus produtividade organização notas planejamento universidade',
    offers: [{
      id: 'notion-education', title: 'Plano Education individual', kind: 'free', scope: 'student',
      summary: 'Plano Education gratuito para estudantes de ensino superior elegíveis, em um espaço com um único membro.',
      price: 'Grátis com e-mail institucional elegível',
      eligibility: 'Instituição de ensino superior reconhecida no WHED e e-mail institucional como endereço principal da conta. A solicitação é feita pelo computador ou pela web; não serve para ensino básico.',
      renewal: 'É preciso revalidar o e-mail institucional a cada ano. Sem validação, o espaço passa ao plano Free. Não equivale a uma assinatura paga de IA.',
      steps: ['Use o e-mail institucional como principal na sua conta Notion.', 'Mantenha um único membro no espaço e esteja no plano Free.', 'Em Configurações, abra o upgrade de plano e solicite o Education gratuito.'],
      officialUrl: 'https://www.notion.com/pt/product/notion-for-education', verifiedAt: INITIAL_VERIFIED_AT,
      sources: [source('Notion para educação', 'https://www.notion.com/pt/help/notion-for-education')],
    }],
  },
  {
    id: 'canva', name: 'Canva', subtitle: 'Teste o Pro nos seus projetos e apresentações',
    topics: ['estudo', 'criatividade'], tone: 'peach', image: 'category-creative.png',
    imageAlt: 'Ilustração de um ateliê com caderno, computador e materiais de criação.',
    description: 'Crie apresentações e projetos visuais com o teste individual do Canva Pro.',
    keywords: 'design apresentação universitários faculdade imagem vídeo',
    offers: [
      {
        id: 'canva-pro-trial', title: 'Canva Pro · 30 dias', kind: 'trial', scope: 'general',
        summary: 'Teste de 30 dias do Canva Pro para contas elegíveis. Universitários também podem usar; a promoção não é exclusiva para estudantes.',
        price: '30 dias grátis para contas elegíveis', renewalPrice: { amount: 35, currency: 'BRL', interval: 'month' },
        eligibility: 'Conta elegível ao teste do Pro no Canva. A duração e as condições finais devem aparecer na sua conta antes de confirmar.',
        renewal: 'Após o teste, o plano é pago. Referência consultada: R$ 35/mês para uma pessoa no plano mensal brasileiro; outras frequências têm valores próprios. Confira cobrança e cancelamento na contratação.',
        steps: ['Abra a página oficial do Canva Pro com sua conta pessoal.', 'Confirme que sua conta mostra o teste de 30 dias.', 'Revise a opção de cobrança, o valor após o teste e a data de renovação.'],
        officialUrl: 'https://www.canva.com/pt_br/pro/', verifiedAt: INITIAL_VERIFIED_AT,
        sources: [source('Planos e preços no Brasil', 'https://www.canva.com/pt_br/precos/'), source('Teste oficial de 30 dias do Pro', 'https://www.canva.com/learn/canva-pro-vs-canva-enterprise/')],
      },
    ],
  },
  {
    id: 'spotify', name: 'Spotify', subtitle: 'Música para estudar e fazer uma pausa',
    topics: ['bem-estar'], tone: 'sage', image: 'category-wellbeing-v2.png',
    imageAlt: 'Ilustração de um canto de leitura junto a uma janela.',
    description: 'Ouça música sem anúncios e baixe suas playlists para os momentos offline.',
    keywords: 'música audio streaming premium universitário playlists pausa',
    offers: [{
      id: 'spotify-premium-student', title: 'Premium Universitário', kind: 'discount', scope: 'student',
      summary: 'Premium individual com preço universitário. Um mês de teste para contas elegíveis que ainda não experimentaram o Premium.',
      price: 'R$ 12,90/mês', renewalPrice: { amount: 12.90, currency: 'BRL', interval: 'month' },
      eligibility: 'Estudantes com mais de 18 anos, matriculados em instituição de ensino superior aceita pela SheerID. O e-mail acadêmico não precisa ser o endereço da conta Spotify.',
      renewal: 'Desconto por até quatro anos, com revalidação a cada 12 meses. Depois do teste, cobrança mensal. Sem renovação da elegibilidade, passa ao preço integral do Individual, informado como R$ 23,90/mês na consulta. Cancele antes da cobrança se não quiser continuar.',
      steps: ['Abra o Premium Universitário e entre na sua conta Spotify.', 'Confirme matrícula e instituição pelo fluxo da SheerID.', 'Revise o teste, o preço mensal e a data da primeira cobrança antes de assinar.'],
      officialUrl: 'https://www.spotify.com/br-pt/student/', verifiedAt: INITIAL_VERIFIED_AT,
      sources: [source('Preço e condições no Brasil', 'https://www.spotify.com/br-pt/student/'), source('Elegibilidade e renovação do Premium Universitário', 'https://support.spotify.com/br-pt/article/premium-student/')],
    }],
  },
  {
    id: 'apple-music', name: 'Apple Music', subtitle: 'Sua trilha sonora com preço universitário',
    topics: ['bem-estar'], tone: 'paper', image: 'category-wellbeing-v2.png',
    imageAlt: 'Ilustração de uma poltrona e um caderno em um canto de leitura.',
    description: 'Explore músicas e playlists no celular ou computador, com downloads para ouvir offline.',
    keywords: 'música audio streaming apple tv universitária pausa',
    offers: [{
      id: 'apple-music-student', title: 'Assinatura Universitária', kind: 'discount', scope: 'student',
      summary: 'Apple Music com preço universitário e um mês de avaliação para novas assinaturas qualificadas. Acesso ao Apple TV incluído por tempo limitado.',
      price: 'R$ 12,90/mês', renewalPrice: { amount: 12.90, currency: 'BRL', interval: 'month' },
      eligibility: 'Estudantes verificados de formação técnica, graduação, pós-graduação ou equivalente de ensino superior elegível. Exige Conta Apple e forma de pagamento válida.',
      renewal: 'Até 48 meses enquanto elegível, com nova verificação do vínculo. Depois do teste, cobrança mensal; ao perder a condição ou atingir o limite, renova como Individual pelo preço vigente. Apple TV é uma inclusão temporária, vinculada ao plano estudantil, sem compartilhamento familiar.',
      steps: ['Abra o Apple Music para estudantes e entre com sua Conta Apple.', 'Escolha a assinatura de estudante e conclua a verificação do vínculo.', 'Confira preço, período de avaliação e cobrança recorrente antes de confirmar.'],
      officialUrl: 'https://music.apple.com/br/student', verifiedAt: INITIAL_VERIFIED_AT,
      sources: [source('Planos e preço brasileiro', 'https://www.apple.com/br/apple-music/'), source('Requisitos da assinatura estudantil', 'https://support.apple.com/pt-br/106008')],
    }],
  },
  {
    id: 'microsoft', name: 'Microsoft', subtitle: 'Word, Excel e espaço para seus estudos',
    topics: ['estudo'], tone: 'sage', image: 'campus.png',
    imageAlt: 'Ilustração de um campus universitário entre árvores.',
    description: 'Aplicativos de produtividade e 1 TB no OneDrive em uma assinatura pessoal do Microsoft 365.',
    keywords: 'office word excel powerpoint onedrive produtividade armazenamento microsoft 365 personal',
    offers: [{
      id: 'microsoft-365-personal-student', title: 'Microsoft 365 Personal estudantil', kind: 'discount', scope: 'student',
      summary: 'A Microsoft anuncia 50% de desconto no Personal para universitários aprovados, com aplicativos de produtividade e 1 TB de armazenamento.',
      price: 'Preço estudantil a consultar na conta',
      eligibility: 'Universitários em tempo integral ou parcial de instituições credenciadas. Use uma Conta Microsoft pessoal; o e-mail acadêmico ou outra comprovação serve à verificação do vínculo.',
      renewal: 'Cobrança mensal com renovação automática. É preciso revalidar a condição estudantil para manter o desconto; sem elegibilidade, passa ao preço mensal integral vigente. Confira o valor em reais e desative a cobrança recorrente se não quiser renovar.',
      steps: ['Abra a oferta brasileira e entre com sua Conta Microsoft pessoal.', 'Confira os detalhes e comprove seu vínculo estudantil no fluxo da Microsoft.', 'Revise o valor em reais, a primeira cobrança e a renovação antes de concluir a compra.'],
      officialUrl: 'https://www.microsoft.com/pt-br/microsoft-365/college-student-pricing', verifiedAt: INITIAL_VERIFIED_AT,
      sources: [source('Oferta individual para universitários no Brasil', 'https://www.microsoft.com/pt-br/microsoft-365/college-student-pricing')],
    }],
  },
  {
    id: 'autodesk', name: 'Autodesk', subtitle: 'Ferramentas para desenhar e construir ideias',
    topics: ['estudo', 'criatividade'], tone: 'ochre', image: 'category-creative.png',
    imageAlt: 'Ilustração de um ateliê com computador e materiais de criação.',
    description: 'Aprenda com ferramentas de projeto e modelagem, como AutoCAD, Revit e Fusion, conforme o produto disponível.',
    keywords: 'autocad revit fusion arquitetura engenharia modelagem cad educação software',
    offers: [{
      id: 'autodesk-education-individual', title: 'Education individual', kind: 'free', scope: 'student',
      summary: 'Acesso gratuito de usuário único por um ano a softwares educacionais disponíveis da Autodesk, renovável enquanto você continuar elegível.',
      price: '1 ano grátis, com renovação estudantil',
      eligibility: 'Estudantes de instituição educacional qualificada, respeitando a idade mínima aplicável e a verificação da Autodesk. Um e-mail acadêmico, sozinho, não confirma a elegibilidade; o fornecedor pode pedir documentação.',
      renewal: 'Renovação anual enquanto elegível. Uso somente para aprendizado e pesquisa educacional; não autoriza trabalho comercial, profissional ou lucrativo. Cada software tem seus requisitos e limites próprios.',
      steps: ['Abra as instruções de acesso individual para estudantes.', 'Selecione o produto e o plano de estudante na Autodesk, usando sua própria conta.', 'Confirme a elegibilidade no fornecedor e, após aprovação, instale o software e acompanhe a renovação anual.'],
      officialUrl: 'https://www.autodesk.com/br/support/account/education/students-educators/get-started', verifiedAt: INITIAL_VERIFIED_AT,
      sources: [source('Introdução como estudante: uso individual', 'https://www.autodesk.com/br/support/account/education/students-educators/get-started'), source('Duração e restrições do Education', 'https://www.autodesk.com/br/support/account/education/students-educators/overview')],
    }],
  },
  {
    id: 'adobe', name: 'Adobe', subtitle: 'Criação com um plano estudantil individual',
    topics: ['criatividade'], tone: 'peach', image: 'category-creative.png',
    imageAlt: 'Ilustração de um ateliê com materiais de desenho e um computador.',
    description: 'Photoshop, Illustrator, Premiere e outros aplicativos no Creative Cloud Pro estudantil.',
    keywords: 'adobe photoshop illustrator premiere fotografia vídeo edição design creative cloud pro',
    offers: [{
      id: 'adobe-creative-cloud-pro-student', title: 'Creative Cloud Pro estudantil', kind: 'discount', scope: 'student',
      summary: 'Campanha para novos assinantes elegíveis: R$ 27,50/mês no primeiro ano. O contrato é anual, com cobranças mensais; não é um plano mensal sem compromisso.',
      price: 'R$ 27,50/mês no primeiro ano · contrato anual',
      renewalPrice: { amount: 139, currency: 'BRL', interval: 'month' },
      eligibility: 'Estudantes qualificados com 18 anos ou mais, em nova assinatura individual comprada diretamente da Adobe. O fornecedor pode exigir e-mail acadêmico ou comprovação do vínculo.',
      renewal: 'Compromisso de 12 meses. Com renovação automática ativa, o valor de referência após o primeiro ano é R$ 139/mês no anual cobrado mensalmente, sujeito a alteração. Cancelar antes do fim pode gerar cobrança; confira os termos brasileiros.',
      redeemBy: '2026-11-27',
      steps: ['Abra a oferta individual para estudantes e confirme a promoção na sua conta.', 'Valide sua elegibilidade no fluxo da Adobe.', 'Confira o contrato de 12 meses, a renovação e as condições de cancelamento antes de pagar.'],
      officialUrl: 'https://www.adobe.com/br/creativecloud/buy/students.html', verifiedAt: VERIFIED_AT,
      sources: [source('Oferta brasileira para estudantes', 'https://www.adobe.com/br/education/students/creativecloud.html'), source('Termos da campanha até 27/11/2026', 'https://www.adobe.com/br/offer-terms/ste-special-offer.html'), source('Assinatura e cancelamento no Brasil', 'https://www.adobe.com/br/legal/subscription-terms.html')],
    }],
  },
  {
    id: 'youtube', name: 'YouTube', subtitle: 'Vídeos e música com alternativas estudantis',
    topics: ['bem-estar'], tone: 'ochre', image: 'category-wellbeing-v2.png',
    imageAlt: 'Ilustração de uma poltrona junto a uma janela voltada para o campus.',
    description: 'Compare Premium e Music Premium avulsos. O Premium já inclui Music Premium; você não precisa assinar ambos.',
    keywords: 'youtube música music premium vídeos streaming entretenimento',
    offers: [
      {
        id: 'youtube-premium-student', title: 'Premium estudantil', kind: 'discount', scope: 'student',
        summary: 'Plano individual para vídeos e música. Já inclui Music Premium; compare com o pacote Google AI Pro + YouTube antes de contratar.',
        price: 'Preço estudantil a consultar na conta',
        eligibility: 'Matrícula em instituição de ensino superior aceita pela SheerID. Brasil consta na lista oficial de países; a aprovação depende do vínculo verificado.',
        renewal: 'Até quatro anos consecutivos, com reverificação anual. A assinatura é paga; confira a cobrança recorrente e eventual teste no resgate. Se já assina YouTube, siga as orientações oficiais de mudança de plano.',
        steps: ['Abra a página Premium estudantil no navegador do celular ou computador.', 'Verifique a matrícula com a SheerID.', 'Confira preço, cobrança e assinaturas que você já possui antes de concluir.'],
        officialUrl: 'https://www.youtube.com/premium/student/inapp', verifiedAt: VERIFIED_AT,
        sources: [source('Elegibilidade, países e renovação', 'https://support.google.com/youtube/answer/9158808?hl=pt-br')],
      },
      {
        id: 'youtube-music-premium-student', title: 'Music Premium estudantil', kind: 'discount', scope: 'student',
        summary: 'Alternativa individual para música. Não equivale ao YouTube Premium para vídeos e já está incluída naquele plano.',
        price: 'Preço estudantil a consultar na conta',
        eligibility: 'Estudantes de ensino superior aprovados pela SheerID em instituição elegível no Brasil.',
        renewal: 'Revalidação anual por até quatro anos consecutivos. Confira valor, cobrança e eventual avaliação na conta; não acumule com outro plano que já inclua Music Premium.',
        steps: ['Abra a página Music Premium estudantil pelo navegador.', 'Conclua a verificação acadêmica na SheerID.', 'Revise o preço e a recorrência antes de confirmar.'],
        officialUrl: 'https://www.youtube.com/musicpremium/student/inapp', verifiedAt: VERIFIED_AT,
        sources: [source('Planos individuais para estudantes', 'https://support.google.com/youtube/answer/9158808?hl=pt-br')],
      },
    ],
  },
  {
    id: 'jetbrains', name: 'JetBrains', subtitle: 'IDEs para aprender e desenvolver projetos',
    topics: ['estudo', 'criatividade'], tone: 'sage', image: 'campus.png',
    imageAlt: 'Ilustração de um campus universitário cercado por árvores.',
    description: 'Ferramentas do Student Pack para programação e pesquisa acadêmica, com licença educacional individual.',
    keywords: 'programação desenvolvimento software intellij pycharm webstorm ide código jetbrains student pack',
    offers: [{
      id: 'jetbrains-student-pack', title: 'Student Pack individual', kind: 'free', scope: 'student',
      summary: 'Acesso educacional gratuito às ferramentas do Student Pack. Recursos de IA podem ter avaliação limitada, com condições próprias.',
      price: 'Grátis para estudantes aprovados',
      eligibility: 'Estudantes de programas credenciados de longa duração, em tempo integral. Confirme a duração mínima no formulário; cursos curtos e bootcamps não qualificam. Use e-mail acadêmico aceito, ISIC ou GitHub Student Developer Pack, conforme o fluxo.',
      renewal: 'Licença de um ano, renovável enquanto elegível. Uso apenas educacional e não comercial: não cobre emprego, estágio ou trabalho freelance. A instituição e o vínculo são avaliados pela JetBrains.',
      steps: ['Abra a página brasileira do Student Pack e solicite a licença individual.', 'Escolha uma forma aceita de verificação e comprove o vínculo diretamente na JetBrains.', 'Ative as ferramentas na sua conta e renove pelo link oferecido antes do vencimento.'],
      officialUrl: 'https://www.jetbrains.com/pt-br/academy/student-pack/', verifiedAt: VERIFIED_AT,
      sources: [source('Student Pack e limites de uso', 'https://www.jetbrains.com/pt-br/academy/student-pack/'), source('Elegibilidade individual', 'https://sales.jetbrains.com/hc/en-gb/articles/11557849416594-Who-is-eligible-for-free-individual-educational-licenses'), source('Restrições para cursos curtos', 'https://sales.jetbrains.com/hc/en-gb/articles/11557859965074-I-am-a-student-in-an-online-course-bootcamp-training-class-or-similar-program-Am-I-eligible-for-a-free-license'), source('Renovação anual', 'https://sales.jetbrains.com/hc/pt-br/articles/11564534574994-Como-renovar-minha-licen%C3%A7a-educacional-gratuita-por-mais-um-ano')],
    }],
  },
  {
    id: 'figma', name: 'Figma', subtitle: 'Design e protótipos para aprender criando',
    topics: ['criatividade', 'estudo'], tone: 'peach', image: 'category-creative.png',
    imageAlt: 'Ilustração de um ateliê com computador e materiais de criação.',
    description: 'Recursos do Professional em uma equipe Education, com solicitação individual para universitários elegíveis.',
    keywords: 'figma figjam design interface ui ux prototipagem colaboração education universitários',
    offers: [{
      id: 'figma-education-student', title: 'Education para universitários', kind: 'free', scope: 'student',
      summary: 'Recursos do Professional em uma equipe Education, sem mensalidade para estudantes verificados. Uso educacional não comercial.',
      price: 'Grátis para estudantes verificados',
      eligibility: 'Universitários com vínculo atual, instituição aceita e e-mail acadêmico compatível. A verificação é feita pela SheerID; no Brasil, há também uma rota documentada pela RNP/CAFe para pessoas elegíveis.',
      renewal: 'Acesso sujeito a reverificação. Confira o vencimento na conta e renove a comprovação enquanto elegível. Ao perder o status Education, a equipe volta ao Starter e a edição pode ser limitada. A IA tem cota mensal, não é ilimitada.',
      steps: ['Entre no Figma com o e-mail acadêmico e abra a solicitação Education.', 'Selecione Higher Ed e Student e informe dados reais de matrícula e conclusão prevista.', 'Conclua a verificação SheerID e, se oferecida, a autenticação pela sua instituição.', 'Crie ou atualize uma equipe para Education e confira a vigência na conta.'],
      officialUrl: 'https://www.figma.com/education/apply', verifiedAt: VERIFIED_AT,
      sources: [source('Figma Education e requisitos', 'https://help.figma.com/hc/en-us/articles/360041061214-Figma-for-Education'), source('Acesso gratuito no Brasil via RNP/CAFe', 'https://www.rnpmais.rnp.br/figma'), source('Gratuidade e FAQ de preços', 'https://www.figma.com/pt-br/pricing-faq/'), source('Cotas de IA do Education', 'https://help.figma.com/hc/en-us/articles/37611757713431-AI-credits-on-the-Education-plan'), source('Orientação do suporte sobre uso não comercial', 'https://forum.figma.com/report-a-problem-6/licensing-question-about-figma-education-plan-56050')],
    }],
  },
];

export const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export const allModes = () => Object.fromEntries(Object.keys(OFFER_KINDS).map(kind => [kind, true]));
export function offerStatus(offer, date = new Date()) {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
  return offer.redeemBy && today > offer.redeemBy ? 'expired' : 'active';
}
export function filterServices({ category = 'todos', query = '', modes = allModes() } = {}) {
  const q = normalize(query);
  return SERVICES.filter(service => category === 'todos' || service.topics.includes(category)).map(service => ({
    ...service,
    offers: service.offers.filter(offer => modes[offer.kind] && normalize(`${service.name} ${service.keywords} ${offer.title} ${offer.summary}`).includes(q)),
  })).filter(service => service.offers.length);
}
export function readFavoriteIds(storage) {
  try {
    const ids = JSON.parse((storage ?? globalThis.localStorage).getItem(FAVORITES_KEY) || '[]');
    // Preserve older saved IDs without treating fictional examples as real services.
    return Array.isArray(ids) ? [...new Set(ids.filter(id => typeof id === 'string'))] : [];
  } catch { return []; }
}
