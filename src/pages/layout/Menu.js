// inserting an SVG




// Some details about the site
exports.siteName = `Cedimed App`;

exports.menu = [
  { slug: '/', title: 'Dashboard', icon: 'dashboard'},
  { slug: '/patient', title: 'Patients', icon: 'patients'},
  { slug: '/appointment', title: 'Appointment', icon: 'appointment'},
  { slug: '/consultation', title: 'Consultation', icon: 'accounting'},
  { slug: '/mriscan', title: 'IRM Scanner', icon: 'accounting'},
  { slug: '/laboratory', title: 'Laboratory', icon: 'laboratory'},
  { slug: '/payment', title: 'Paiement', icon: 'accounting'},
  { slug: '/medicalsettings', title: 'Medical Parametres', icon: 'settings'},

  { slug: '#', title: 'Ressource Humaine', icon: 'patients', 
    submenu:[
      {slug: '/employee', title: 'Employes', icon: 'patients'},
      {slug: '/doctor', title: 'Doctors', icon: 'patients'},
      {slug: '/employeecontract', title: 'Contrat Employee', icon: 'patients'},
      {slug: '/salary', title: 'Contrat de Salaire', icon: 'accounting'},
      {slug: '/medicalsettings', title: 'RH Parametres', icon: 'patients'},
    ]
  },

  { slug: '#', title: 'Gestion Commercial', icon: 'accounting',
    submenu:[
      {slug: '/customer', title: 'Client', icon: 'accounting'},
      {slug: '/supplier', title: 'Fournisseur', icon: 'accounting'},
      {slug: '/invoice', title: 'Facture', icon: 'accounting'},
      {slug: '/quote', title: 'Devis', icon: 'accounting'},
      {slug: '/orderform', title: 'Bon de commande', icon: 'accounting'},
      {slug: '/clientpayment', title: 'Regelement', icon: 'accounting'},
      {slug: '/expenses', title: 'Depences', icon: 'accounting'},
      {slug: '/financesettings', title: 'Finance Parametres', icon: 'patients'},
    ]
  },

  { slug: '/rapport', title: 'Rapport', icon: 'settings', },
  { slug: '/generalsettings', title: 'Parametres Generale', icon: 'settings', },
];
