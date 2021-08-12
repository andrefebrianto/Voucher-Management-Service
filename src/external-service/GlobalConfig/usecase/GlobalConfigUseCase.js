const GlobalConfigService = require('../service/GlobalConfigService');

class GlobalConfigUseCase {
    static getActivePartnerProgram(partnerCode) {
        return GlobalConfigService.getActivePartnerProgram(partnerCode);
    }
}

module.exports = GlobalConfigUseCase;
