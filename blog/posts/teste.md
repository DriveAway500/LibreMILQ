---
Title: Kernel Customization
Author: 500Mice
---

# Kernel Customization on Arch Linux

Este é um exemplo de artigo que foi renderizado automaticamente pelo leitor Markdown. Quando você joga este arquivo dentro da pasta `/posts`, nosso script lê estas informações e monta a página de forma automatizada.

## Por que usar Markdown no servidor?

* **Leveza:** Arquivos de texto puro não consomem quase nada de memória ou processamento.
* **Sem Banco de Dados:** Você não precisa configurar o SQLite ou MySQL para gerenciar posts.
* **Portabilidade:** Mudar de servidor ou fazer backup se resume a apenas copiar uma pasta de arquivos de texto.

### Configurações de Compilação

Para compilar o seu próprio kernel no terminal, execute:

```bash
make menuconfig
make -j$(nproc)
sudo make modules_install
sudo make install