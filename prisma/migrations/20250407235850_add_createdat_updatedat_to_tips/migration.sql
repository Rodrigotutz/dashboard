-- Adiciona colunas com valores padrão para linhas existentes
ALTER TABLE "tips" 
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Cria trigger para atualização automática
CREATE OR REPLACE FUNCTION update_tips_updated_at()
RETURNS TRIGGER AS $$
BEGIN
   NEW."updatedAt" = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_tips_updated_at
BEFORE UPDATE ON "tips"
FOR EACH ROW
EXECUTE FUNCTION update_tips_updated_at();