const PaypalButton = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://www.paypal.com/sdk/js?client-id=AXy1YZNZsMCdiYVhh_jyoYW9_HkylFwgkL75WNGw924gL4jHcW5myCTH5JGOyyMiuZSabMWpovoarBnQ&vault=true&intent=subscription';
    script.async = true;

    script.onload = () => {
      paypal
        .Buttons({
          style: {
            shape: 'rect',
            color: 'blue',
            layout: 'vertical',
            label: 'paypal',
          },
          createSubscription: function (data, actions) {
            return actions.subscription.create({
              /* Creates the subscription */
              plan_id: 'P-6NV451935K3609258MV3DRUQ',
            });
          },
          onApprove: function (data, actions) {
            alert(data.subscriptionID); // You can add optional success message for the subscriber here
          },
        })
        .render('#paypal-button-container-P-6NV451935K3609258MV3DRUQ'); // Renders the PayPal button
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="paypal-button-container-P-6NV451935K3609258MV3DRUQ"></div>;
};
