import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // 1. Grant public access to read endpoints
    try {
      const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' }
      });
      if (publicRole) {
        const permissionsToGrant = [
          'api::partner.partner.find',
          'api::partner.partner.findOne',
          'api::faq.faq.find',
          'api::faq.faq.findOne',
          'api::article.article.find',
          'api::article.article.findOne',
        ];

        for (const action of permissionsToGrant) {
          const existingPermission = await strapi.query('plugin::users-permissions.permission').findOne({
            where: { role: publicRole.id, action }
          });
          if (!existingPermission) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: {
                role: publicRole.id,
                action
              }
            });
          }
        }
      }
    } catch (error) {
      console.error('Error granting permissions on bootstrap', error);
    }

    // 2. Create sample partners if none exist
    try {
      const partnerCount = await strapi.db.query('api::partner.partner').count();
      if (partnerCount === 0) {
        const dummyPartners = [
          { name: 'Gerdau' },
          { name: 'Votorantim' },
          { name: 'ArcelorMittal' },
          { name: 'Tigre' },
          { name: 'Amanco' },
          { name: 'Bosch' }
        ];
        
        for (const partner of dummyPartners) {
          await strapi.db.query('api::partner.partner').create({
            data: {
              name: partner.name,
              publishedAt: new Date(),
              documentId: Math.random().toString(36).substring(2, 15) // simple random ID just in case
            }
          });
        }
        console.log('Dummy partners created via db.query');
      }
    } catch (error) {
      console.error('Error creating dummy partners', error);
    }
  },
};
