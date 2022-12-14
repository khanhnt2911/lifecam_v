/**
 *
 * PaymentPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectPaymentPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

/* eslint-disable react/prefer-stateless-function */
export class PaymentPage extends React.Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>PaymentPage</title>
          <meta name="description" content="Description of PaymentPage" />
        </Helmet>
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

PaymentPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  paymentPage: makeSelectPaymentPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'paymentPage', reducer });
const withSaga = injectSaga({ key: 'paymentPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(PaymentPage);
