//
//  Battery.h
//  iOSBatteryStatus
//
//  Created by mac on 2012/7/13.
//  Copyright (c) 2012年 __MyCompanyName__. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <Cordova/CDVPlugin.h>

@interface Battery : CDVPlugin {
    NSString *win;
    NSString *fail;
}

-(void) get:(NSMutableArray*)arguments
   withDict:(NSMutableDictionary*)options;
@end

