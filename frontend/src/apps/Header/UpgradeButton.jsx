import { Button, Badge } from 'antd';
import { RocketOutlined, ArrowUpOutlined } from '@ant-design/icons'; // Added another icon option
import useLanguage from '@/locale/useLanguage';

// Define a constant for the enterprise URL
const ENTERPRISE_URL = 'https://entreprise.idurarapp.com';
// Define a constant for the commercial services email
const COMMERCIAL_EMAIL = 'hello@idurarapp.com';

/**
 * UpgradeButton component displays a prominent button to promote the Enterprise version
 * and handles the redirection.
 */
export default function UpgradeButton() {
  const translate = useLanguage();

  const handleUpgradeClick = () => {
    // Open the enterprise URL in a new tab
    window.open(ENTERPRISE_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="upgrade-button-container">
      <Badge dot count={1} offset={[-2, 2]} size="small"> {/* Changed to 'dot' and added offset for better positioning */}
        <Button
          type="primary"
          className="upgrade-button" // Use a CSS class for styling
          icon={<RocketOutlined />} // Kept the Rocket icon
          onClick={handleUpgradeClick}
          // The style object is now more focused on essential overrides,
          // with most styling moved to a potential CSS file (suggested by className).
          style={{
            background: '#16923e', // A specific, strong green for emphasis
            borderColor: '#16923e',
            // Float is generally discouraged in modern React/CSS, but kept for direct functional replacement
            float: 'right', 
          }}
        >
          {translate('Try Entreprise Version')}
        </Button>
      </Badge>
    </div>
  );
}

// Log the commercial message to the console for marketing/support.
console.log(
  `🚀 Welcome to IDURAR ERP CRM! Did you know that we also offer commercial customization services? Contact us at ${COMMERCIAL_EMAIL} for more information.`
);

// Note: If you want to use CSS Modules or a separate stylesheet for better practice, 
// you would define the 'upgrade-button' class:
/*
.upgrade-button {
  margin-top: 5px;
  cursor: pointer;
  box-shadow: 0 2px 0 rgb(82 196 26 / 20%);
}
*/
