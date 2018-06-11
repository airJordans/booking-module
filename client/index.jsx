import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import axios from 'axios';
import PricePerNight from './components/PricePerNight.jsx';
import Rating from './components/Rating.jsx';
import Dates from './components/Dates.jsx';
import Guests from './components/Guests.jsx';
import CostSummary from './components/cost-summary/CostSummary.jsx';
import BookButton from './components/BookButton.jsx';
import Calendar from './components/calendar/Calendar.jsx';

const OuterDiv = styled.div`
  width: 376px;
  margin-left: 45px;
`;

const MainDiv = styled.div`
  display: block;
  padding: 24px 24px 24px 24px;
  margin: 16px 0px 24px 0px;
  border: 1px solid #e4e4e4;
  background-color: #ffffff;
  font-family: Helvetica Neue,sans-serif;
  font-size: 14px;
`;

const MarginLine = styled.div`
  margin-top: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #DBDBDB;
`;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listingId: 1,
      costPerNight: 0,
      totalReviews: 0,
      rating: 0,
      stars: [],
      costSummaryDisplayed: false,
      selectedStartDate: '',
      selectedEndDate: '',
      cleaningFee: 0,
      serviceFeePerc: 0,
      occTaxRatePerc: 0,
      additionalGuestFee: 0,
    };

    this.handleDateSelection = this.handleDateSelection.bind(this);
  }

  componentDidMount() {
    this.getCoreData();
  }

  getCoreData() {
    axios.get(`/booking/core/listingId/${this.state.listingId}`)
      .then((response) => {
        const listing = response.data[0];
        this.setState({
          costPerNight: listing.avg_cost_per_night,
          totalReviews: listing.review_count,
          rating: listing.avg_rating,
          cleaningFee: listing.cleaning_fee,
          serviceFeePerc: listing.service_fee_perc,
          occTaxRatePerc: listing.occ_tax_rate_perc,
          additionalGuestFee: listing.additional_guest_fee,
        }, this.getStarArray);
      })
      .catch(error => console.log(error)); // TO DO: what is correct error handling?
  }


  getStarArray() {
    const stars = [];
    // get whole stars
    for (let i = 0; i < Math.floor(this.state.rating); i += 1) {
      stars.push('1');
    }

    if (this.state.rating < 5) {
      // check if half star is needed
      if (this.state.rating % 1 >= 0.5) {
        stars.push('.5');
      } else {
        stars.push('0');
      }

      // fill in rest of array
      while (stars.length < 5) {
        stars.push('0');
      }
    }

    this.setState({ stars });
  }

  handleDateSelection(startDate, endDate) {
    this.setState({
      selectedStartDate: startDate,
      selectedEndDate: endDate,
    }, () => {
      this.setState({
        costSummaryDisplayed: !!(this.state.selectedStartDate && this.state.selectedEndDate),
      });
    });
  }

  render() {
    return (
      <div>
        <OuterDiv>
          <MainDiv id="app">
            <div id="summary-header">
              <PricePerNight costPerNight={this.state.costPerNight} />
              <Rating stars={this.state.stars} totalReviews={this.state.totalReviews} />
            </div>
            <MarginLine />
            <Dates />
            <Guests />
            <CostSummary
              display={this.state.costSummaryDisplayed}
              listingId={this.state.listingId}
              startDate={this.state.selectedStartDate}
              endDate={this.state.selectedEndDate}
              costPerNight={this.state.costPerNight}
              cleaningFee={this.state.cleaningFee}
              serviceFeePerc={this.state.serviceFeePerc}
              occTaxRatePerc={this.state.occTaxRatePerc}
              additionalGuestFee={this.state.additionalGuestFee}
            />
            <BookButton />
          </MainDiv>
        </OuterDiv>
        <Calendar listingId={this.state.listingId} handleDateSelection={this.handleDateSelection} />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('booking-module'));
