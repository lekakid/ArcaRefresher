import React from 'react';

import AnonymousNick from 'feature/AnonymousNick';
import AutoRefresher from 'feature/AutoRefresher';
import CategoryStyler from 'feature/CategoryStyler';
import CommentRefresh from 'feature/CommentRefresh';
import ExperienceCustom from 'feature/ExperienceCustom';
import ImageDownloader from 'feature/ImageDownloader';
import IPInfo from 'feature/IPInfo';
import LayoutCustom from 'feature/LayoutCustom';
import Memo from 'feature/Memo';
import Mute from 'feature/Mute';
import MyImage from 'feature/MyImage';
import ShortCut from 'feature/ShortCut';
import TemporarySave from 'feature/TemporarySave';
import ThemeCustomizer from 'feature/ThemeCustomizer';
import UserColor from 'feature/UserColor';

export default () => (
  <>
    <LayoutCustom />
    <ThemeCustomizer />
    <AutoRefresher />
    <CommentRefresh />
    <ImageDownloader />
    <IPInfo />
    <AnonymousNick />
    <Memo />
    <ExperienceCustom />
    <TemporarySave />
    <Mute />
    <MyImage />
    <CategoryStyler />
    <UserColor />
    <ShortCut />
  </>
);
