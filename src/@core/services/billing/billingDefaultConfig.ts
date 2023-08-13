import { TRegionConfig } from "@core/services/interfaces/covarege-area/region/IRegionService";

const regionConfig: TRegionConfig = {
  // Endpoints
  getActiveRegionsEndpoint: "/api/AreasAbrangencia/RegiaoOperacional/ObterRegioesOperacionaisAtivas",
  getRegionEndpoint: "/api/AreasAbrangencia/RegiaoOperacional/ObterRegiaoOperacioalPorId",
  listRegionEndpoint: "/api/AreasAbrangencia/RegiaoOperacional/ListarRegioesOperacionais",
  createRegionEndpoint: "/api/AreasAbrangencia/RegiaoOperacional/CriarRegiaoOperacional",
  updateRegionEndpoint: "/api/AreasAbrangencia/RegiaoOperacional/AtualizarRegiaoOperacional",
  getCityRegionEndpoint: "/api/AreasAbrangencia/RegiaoOperacional/ListarMunicipiosDaRegiaoOperacional",
  getRegionScopeEndpoint: "/api/AreasAbrangencia/RegiaoOperacional/ObterRegioesOperacionaisEscopo" 
}

export default regionConfig;