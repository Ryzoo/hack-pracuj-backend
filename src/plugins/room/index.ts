import fp from 'fastify-plugin';

import { QueueNames } from '../core/types/queue-names';
import cleanSiteData from './consumers/clean-site-data';
import domainSite from './routes/routes-domain';
import routesSite from './routes/routes-site';
import addDomainsToSiteTask from './scheduled/add-domains-to-site-task';
import checkDomainsDnsTask from './scheduled/check-domains-dns-task';
import createDomainsSslTask from './scheduled/create-domains-ssl-task';

const plugin = fp(
  async (server) => {
    server.rabbitmq.createConsumer(
      {
        queue: QueueNames.CLEAN_SITE_DATA,
        queueOptions: {
          durable: true,
        },
        qos: { prefetchCount: 2 },
      },
      (msq) => cleanSiteData(server, msq),
    );

    server.register(routesSite, { prefix: '/api/v1/site' });
    server.register(domainSite, { prefix: '/api/v1/site/domain' });

    // At every minute.
    server.crons.schedule('* * * * *', checkDomainsDnsTask(server));
    server.crons.schedule('* * * * *', createDomainsSslTask(server));
    server.crons.schedule('* * * * *', addDomainsToSiteTask(server));
  },
  {
    name: 'core-site',
    dependencies: ['core-database', 'core-queue'],
  },
);

export default plugin;
