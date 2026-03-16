from langchain_xai import ChatXAI
from langchain_anthropic import ChatAnthropic

# === COLOQUE SUAS CHAVES AQUI ===
grok = ChatXAI(api_key="xai-sua-chave-aqui", model="grok-4")
claude = ChatAnthropic(api_key="sk-ant-sua-chave-aqui", model="claude-4-sonnet-2026")

print("✅ Grok e Claude estão conectados e prontos!\n")

while True:
    pergunta = input("\nDigite sua pergunta (ou digite 'sair' para parar): ")
    if pergunta.lower() == "sair":
        print("Até mais!")
        break

    print("\n🔥 Grok pensando...")
    resposta_grok = grok.invoke(pergunta)
    print("Grok:", resposta_grok.content)

    print("\n🧠 Claude analisando...")
    resposta_claude = claude.invoke(f"Analise, melhore e dê uma versão mais técnica e precisa desta ideia: {resposta_grok.content}")
    print("Claude:", resposta_claude.content)