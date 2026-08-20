import './Layout.css';

// Componente simples que só existe para centralizar o conteúdo da página
// e dar um respiro (padding) nas bordas. "children" é tudo que for
// colocado entre <Layout> e </Layout> por quem usar esse componente —
// é assim que o React permite "embrulhar" outros elementos.
function Layout({ children }) {
  return <main className="layout">{children}</main>;
}

export default Layout;
