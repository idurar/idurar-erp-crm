import React from 'react'

const Header = () => (
    <div className="headerNav">
        <div className="profile">
            <img className="single__image" src="/images/photos/profile.jpg" />
        </div>
        <div className="account-dropdown">
            <a href="#">Link 1</a>
            <a href="#">Link 2</a>
            <a href="#">Link 3</a>
        </div>
    </div>
)

export default Header
