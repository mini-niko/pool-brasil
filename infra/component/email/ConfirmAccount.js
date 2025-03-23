import { Body, Container, Head, Html, Img } from "@react-email/components";

function EmailComponent({ token = "" }) {
  return (
    <Html>
      <Head>
        <style>
          {`
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
            }
  
            .container {
              display: flex;
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              padding: 20px;
            }
  
            .header, .footer {
              text-align: center;
            }
  
            .header img, .footer img {
              padding: 1rem 0;
              width: 100%;
              height: auto;
              background-color: #01456B;
            }
  
            .content {
              text-align: center;
              margin: 20px 0;
            }
  
            h1 {
              color: #333333;
              font-size: 24px;
              margin: 0;
            }
  
            p {
              font-size: 16px;
              color: #555555;
              margin: 10px 0;
            }
  
            .button {
              background-color: #007bff;
              color: white;
              padding: 15px 25px;
              text-decoration: none;
              font-size: 16px;
              border-radius: 5px;
              display: inline-block;
              margin-top: 20px;
            }
  
            .footer p {
              font-size: 12px;
              color: #888888;
            }
          `}
        </style>
      </Head>
      <Body>
        <Container className="container">
          <div className="header">
            <Img
              src="http://localhost:3000/nome_branco.png"
              alt="Logo"
              className="logo"
            />
          </div>

          <div className="content">
            <h1>Ative sua conta!</h1>
            <p>
              Olá, obrigado por se cadastrar em nosso site. Para ativar sua
              conta, clique no botão abaixo:
            </p>

            <a
              href={`http://localhost:3000/conta_confirmada?token=${token}`}
              className="button"
            >
              Ativar Conta
            </a>
          </div>

          <div className="footer">
            <p>Se você não se cadastrou, por favor, ignore este e-mail.</p>
          </div>
        </Container>
      </Body>
    </Html>
  );
}

export default EmailComponent;
