
import { fetchCafeteriaMenus, Campus } from './services/cafeteriaScraper';

const verify = async () => {
    console.log('Verifying Sinchon Campus...');
    const sinchonMenus = await fetchCafeteriaMenus(Campus.SINCHON);
    console.log(JSON.stringify(sinchonMenus, null, 2));

    console.log('\nVerifying Songdo Campus...');
    const songdoMenus = await fetchCafeteriaMenus(Campus.SONGDO);
    console.log(JSON.stringify(songdoMenus, null, 2));
};

verify();
