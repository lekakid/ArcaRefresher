import React from 'react';

import * as AnonymousNick from 'feature/AnonymousNick';
import * as AutoRefresher from 'feature/AutoRefresher';
import * as CategoryStyler from 'feature/CategoryStyler';
import * as CommentRefresh from 'feature/CommentRefresh';
import * as ExperienceCustom from 'feature/ExperienceCustom';
import * as ImageDownloader from 'feature/ImageDownloader';
import * as Info from 'feature/Info';
import * as IPInfo from 'feature/IPInfo';
import * as LayoutCustom from 'feature/LayoutCustom';
import * as Memo from 'feature/Memo';
import * as Mute from 'feature/Mute';
import * as MyImage from 'feature/MyImage';
import * as TemporarySave from 'feature/TemporarySave';
import * as ThemeCustomizer from 'feature/ThemeCustomizer';
import * as UserColor from 'feature/UserColor';

function FeatureWrapper() {
  return (
    <>
      <LayoutCustom.Feature />
      <ThemeCustomizer.Feature />
      <AutoRefresher.Feature />
      <CommentRefresh.Feature />
      <ImageDownloader.Feature />
      <Info.Feature />
      <IPInfo.Feature />
      <AnonymousNick.Feature />
      <Memo.Feature />
      <ExperienceCustom.Feature />
      <TemporarySave.Feature />
      <Mute.Feature />
      <MyImage.Feature />
      <CategoryStyler.Feature />
      <UserColor.Feature />
    </>
  );
}

export default FeatureWrapper;
