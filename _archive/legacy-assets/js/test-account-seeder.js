/**
 * Kontenlage — Test Account Seeder v6.2
 * 4 Full Access Test Profiles for all 4 subscription tiers:
 * 0: Free Starter (0 €)
 * 1: Pro Investor (9 € / Mo)
 * 2: Executive & B2B (29 € / Mo)
 * 3: Private Banking & Owner (49 € / Mo)
 */

(function seedKontenlageTestAccounts() {
  const KONTENLAGE_TEST_ACCOUNTS = [
    {
      id: 'kl_test_free_001',
      email: 'free.investor@kontenlage.test',
      password: 'FreeStarter2026!',
      name: 'Maximilian Free',
      avatar: '🌱',
      plan: 'free',
      planLabel: 'Free Starter 🌱',
      features: {
        basicCalcs: true,
        assetCompass: true,
        freeChecklist: true,
        calcLimitPerMonth: 3,
        proSimulations: false,
        advancedSliders: false,
        taxMatrices: false,
        excelVault: false,
        deepResearch: false
      }
    },
    {
      id: 'kl_test_pro_002',
      email: 'pro.investor@kontenlage.test',
      password: 'ProInvestor2026!',
      name: 'Elena Pro',
      avatar: '📈',
      plan: 'pro_investor',
      planLabel: 'Pro Investor 📈 (9 €/Mo)',
      features: {
        basicCalcs: true,
        assetCompass: true,
        freeChecklist: true,
        calcLimitPerMonth: null,
        proSimulations: true,
        advancedSliders: true,
        taxMatrices: true,
        interestRadar: true,
        taxAlerts: true,
        excelVault: false,
        deepResearch: false
      }
    },
    {
      id: 'kl_test_exec_003',
      email: 'executive.b2b@kontenlage.test',
      password: 'Executive2026!',
      name: 'Dr. Florian Executive',
      avatar: '📑',
      plan: 'executive_b2b',
      planLabel: 'Executive & B2B 📑 (29 €/Mo)',
      features: {
        basicCalcs: true,
        assetCompass: true,
        freeChecklist: true,
        calcLimitPerMonth: null,
        proSimulations: true,
        advancedSliders: true,
        taxMatrices: true,
        interestRadar: true,
        taxAlerts: true,
        excelVault: true, // Downloadable Excel & Sheets Vault
        holdingModels: true,
        deepResearch: false
      }
    },
    {
      id: 'kl_test_owner_004',
      email: 'owner.research@kontenlage.test',
      password: 'PrivateOwner2026!',
      name: 'Alexander Private Owner',
      avatar: '👑',
      plan: 'private_owner',
      planLabel: 'Private Banking & Owner 👑 (49 €/Mo)',
      is_private_owner: true,
      features: {
        basicCalcs: true,
        assetCompass: true,
        freeChecklist: true,
        calcLimitPerMonth: null,
        proSimulations: true,
        advancedSliders: true,
        taxMatrices: true,
        interestRadar: true,
        taxAlerts: true,
        excelVault: true,
        holdingModels: true,
        deepResearch: true, // Deep Research Engine & Decision Journal
        decisionJournal: true,
        protocolAudit: true
      }
    }
  ];

  localStorage.setItem('kontenlage_test_accounts', JSON.stringify(KONTENLAGE_TEST_ACCOUNTS));

  // Set Pro Investor as default active user
  const defaultAcc = KONTENLAGE_TEST_ACCOUNTS[1];
  if (!localStorage.getItem('kontenlage_user')) {
    localStorage.setItem('kontenlage_user', JSON.stringify(defaultAcc));
  }

  window.switchTestAccount = function(index) {
    const acc = KONTENLAGE_TEST_ACCOUNTS[index];
    if (!acc) {
      console.warn('Kein Account an Index', index, '(0–3)');
      return;
    }
    localStorage.setItem('kontenlage_user', JSON.stringify(acc));
    console.log('🔄 Kontenlage Kabinett gewechselt zu:', acc.name, '|', acc.planLabel);
    if (window.klCabinet && typeof window.klCabinet.updateNavState === 'function') {
      window.klCabinet.currentUser = acc;
      window.klCabinet.updateNavState();
    }
    window.location.reload();
  };

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🏛️ KONTENLAGE — TEST ACCOUNTS SEEDED (4 TIERS)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  KONTENLAGE_TEST_ACCOUNTS.forEach((acc, i) => {
    console.log('[' + i + '] ' + acc.avatar + ' ' + acc.name + ' | ' + acc.planLabel);
    console.log('    📧 ' + acc.email + '  🔑 ' + acc.password);
    console.log('    ▶ switchTestAccount(' + i + ') zum sofortigen Wechseln');
    console.log('');
  });
  console.log('▶ Pro Investor (9 €/Mo) ist aktiv. Wechsle mit switchTestAccount(0–3)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
})();
