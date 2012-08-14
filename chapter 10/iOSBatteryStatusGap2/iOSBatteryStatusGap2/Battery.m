//
//  Battery.m
//  iOSBatteryStatus
//
//  Created by mac on 2012/7/13.
//  Copyright (c) 2012年 __MyCompanyName__. All rights reserved.
//

#import "Battery.h"

@implementation Battery

-(void) get:(NSMutableArray*)arguments
   withDict:(NSMutableDictionary*)options {
    win = [arguments objectAtIndex:0];
    fail = [arguments objectAtIndex:1];
    NSString* jsString = NULL;
    CDVPluginResult* result = nil;
    
    @try {
        NSUInteger status = 50;
        
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                messageAsString:[NSString  
												 stringWithFormat: 
												 @"{\\\"level\\\":%d}", status]];
        jsString = [result toSuccessCallbackString:win];
    }
    @catch (NSException *exception) {
        result = [CDVPluginResult  
				  resultWithStatus:CDVCommandStatus_ERROR  
				  messageAsString:@"error: could not read battery!"];
        jsString = [result toErrorCallbackString:fail];
    }
    @finally {
        [[self webView]  
		 stringByEvaluatingJavaScriptFromString:jsString];
    }
}

@end
