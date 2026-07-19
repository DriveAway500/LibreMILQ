---
title: Atualizações Atômicas no Debian
author: Zeon
---

Como Ter Atualizações Atômicas no Debian sem Imutabilidade com o napt
napt é um package manager transacional feito em c++23 baseado na libapt,embora seja feito para o Arvor Linux,ele funciona em outros sistemas,desde que Baseado em Debian.
para instalá-lo:
primeiro instale o nsm: (o napt depende dele)
```bash
git clone https://github.com/NextFerret/nsm
```
e as dependencias:
```bash
sudo apt install \
    build-essential \
    util-linux \
    lvm2 \
    initramfs-tools \
    psmisc
```
```bash
cd nsm && gcc -o nsm nsm.c && sudo install -m 755 nsm /usr/bin/nsm
```
e em seguida o napt:
```bash
git clone https://github.com/NextFerret/napt
```
```bash
sudo apt install \
    build-essential \
    libapt-pkg-dev \
    lvm2 \
    util-linux \
    curl
```
```bash
cd napt && g++ -std=c++23 -Wall -Wextra -Werror -O2  -o napt napt-libapt.cpp -lapt-pkg -lpthread && sudo install -m 755 napt /usr/bin/napt
```
A sintaxe do Napt é simples e direta. Porém, em alguns casos, ainda pode ser necessário usar o APT tradicional para pesquisar e localizar pacotes.

Comandos:

  install          Instala pacotes ou arquivos .deb locais dentro de um chroot; aplica as alterações no sistema hospedeiro somente após uma conclusão bem-sucedida.
  remove           Remove pacotes dentro de um chroot; aplica as alterações no sistema hospedeiro somente após uma conclusão bem-sucedida.
  sync             Atualiza os metadados dos repositórios.
  upgrade          Atualiza todos os pacotes ou pacotes específicos utilizando o método "chroot primeiro".
  dist-upgrade     Executa uma atualização completa da distribuição.
  purge            Remove pacotes junto com seus arquivos de configuração.
  clean            Limpa o cache de pacotes baixados pelo Napt.

Opções:

  --apply-host     Ignora o ambiente chroot e aplica as alterações diretamente no sistema hospedeiro.
  --v              Exibe a versão do Napt.
  --vb             Ativa o modo de log detalhado (verbose) para depuração das transações da libapt.
  -h               Exibe esta mensagem de ajuda.