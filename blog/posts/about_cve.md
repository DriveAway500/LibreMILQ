---
title: O que é uma CVE e como interpretá-la
author: 500Mice
---

Algumas pessoas no servidor têm dúvidas sobre o que é uma CVE e como interpretá-las, por isso, decidi escrever este pequeno artigo sobre o assunto explicando alguns detalhes. Para isso, vou escolher uma CVE ao acaso, não há nada de especial nela, se trata apenas de um exemplo utilizado para a explicação.

## CVE-2025-13191

Uma dúvida comum é simplesmente o que o nome significa. Não se trata de nada complicado. Uma CVE segue o seguinte padrão em seu nome:

`CVE-ANO-NÚMERO_SEQUENCIAL`

No nosso caso, ela foi registrada (não necessariamente descoberta) em 2025 e tem o número sequencial 13191. O ID pode ser atribuído por uma CNA, uma autoridade de numeração de CVEs. Alguns exemplos são o Google, Microsoft ou a própria MITRE.

## O que é a MITRE?

A MITRE Corporation é a organização responsável por criar e manter o sistema CVE (*Common Vulnerabilities and Exposures*). A MITRE também coordena a rede de CNAs (*CVE Numbering Authorities*), entidades autorizadas a emitir IDs CVE, e valida que cada solicitação realmente se trata de uma vulnerabilidade relevante e previamente não catalogada.

## O que significa o score?

O score CVSS de uma CVE vai de **0.0** a **10.0** e pode ser atualizado com o tempo. Obviamente ele representa a gravidade e o risco da vulnerabilidade:

* **0.0:** Uma vulnerabilidade sem grande impacto.
* **9.0 a 10.0:** Representa um risco crítico à empresa ou entidade que a possui.

Nossa CVE de exemplo tem um score de **9.0**, o que significa que ela é considerada grave. Você pode facilmente encontrar detalhes sobre ela na internet indicando o que ela afeta.

A CVE-2025-13191 é uma falha no roteador **D-Link DIR-816L** (versão `2_06_b09_beta`). A falha permite *buffer overflow* remoto, que pode ser utilizado para sobrescrever partes do código do firmware do roteador. Essa é uma falha grave, já que o firmware pode ser considerado a "alma" do equipamento. Por isso o score tão alto de 9.0.