export type SearchResultItem = {
  titulo: string;
  descricao: string;
  link_acesso: string;
  orgao_gestor: string;
  servico: boolean;
  id?: string;
  id_carioca_digital?: number;
  id_1746?: number;
  atividades_do_cidadao?: string;
  custo_do_servico?: string;
  disponivel_via_aplicativo?: boolean;
  etapas?: string[];
  informacao_geral_para_atendimento_presencial?: string;
  informacoes_complementares?: string;
  link_para_atendimento?: string;
  local_para_atendimento_presencial?: string;
  prazo_esperado?: string;
  produtos_do_servico?: boolean;
  publico_atendido?: string;
  resultado_da_solicitacao?: string;
  servico_em_manutencao?: boolean;
  tempo_para_atendimento?: string;
  ultima_atualizacao?: string;
  tipo?: string;
  url?: string;
  valor_a_ser_pago?: string;
  link_carioca_digital?: string;
  category?: {
    macro: string;
    micro: string;
    specific: string;
  };
  collection?: string;
};
