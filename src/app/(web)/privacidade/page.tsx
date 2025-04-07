export default function PrivacidadePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-neutral-900">
      <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>

      <p className="mb-4">
        Esta Política de Privacidade descreve como o Tutz Sistema coleta, usa e
        protege as informações que você fornece ao utilizar nossa aplicação.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        1. Informações Coletadas
      </h2>
      <p className="mb-4">
        Coletamos informações fornecidas por você, como nome, e-mail e dados de
        autenticação. Quando você opta por se conectar com sua Conta Google,
        também armazenamos tokens de acesso e informações necessárias para
        integração com o Google Agenda.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        2. Uso das Informações
      </h2>
      <p className="mb-4">Utilizamos suas informações para:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Autenticar seu acesso ao sistema</li>
        <li>Sincronizar eventos com o Google Agenda</li>
        <li>Melhorar a experiência de uso do aplicativo</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        3. Compartilhamento de Informações
      </h2>
      <p className="mb-4">
        Suas informações não são compartilhadas com terceiros. Os dados de
        acesso à sua conta Google são usados exclusivamente para fins de
        integração, com seu consentimento.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        4. Armazenamento e Segurança
      </h2>
      <p className="mb-4">
        Armazenamos seus dados de forma segura utilizando criptografia e medidas
        técnicas apropriadas para proteger suas informações contra acesso não
        autorizado.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">5. Seus Direitos</h2>
      <p className="mb-4">
        Você pode solicitar a exclusão dos seus dados a qualquer momento. Basta
        entrar em contato conosco pelo e-mail informado abaixo.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">6. Contato</h2>
      <p className="mb-4">
        Para dúvidas ou solicitações relacionadas à sua privacidade, entre em
        contato: contato@tutz.app.br
      </p>
    </div>
  );
}
