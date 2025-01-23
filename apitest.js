const axios = require('axios');

describe('API Automation Test', function() {
    this.timeout(10000); 

    it('should verify the response contains 3 BPIs and GBP description', async () => {
        const { expect } = await import('chai');

        const response = await axios.get('https://api.coindesk.com/v1/bpi/currentprice.json');

        const bpi = response.data.bpi;
        expect(bpi).to.have.all.keys('USD', 'GBP', 'EUR');

        expect(bpi.GBP.description).to.equal('British Pound Sterling');
    });
});