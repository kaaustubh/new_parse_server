var PushRouter = require('../src/Routers/PushRouter').PushRouter;
var request = require('request');

describe('PushRouter', () => {
    it('can check valid master key of request', (done) => {
    // Make mock request
    var request = {
      info: {
        masterKey: 'masterKey'
      },
      config: {
        masterKey: 'masterKey'
      }
    }

    expect(() => {
      PushRouter.validateMasterKey(request);
    }).not.toThrow();
    done();
  });

  it('can check invalid master key of request', (done) => {
    // Make mock request
    var request = {
      info: {
        masterKey: 'masterKey'
      },
      config: {
        masterKey: 'masterKeyAgain'
      }
    }

    expect(() => {
      PushRouter.validateMasterKey(request);
    }).toThrow();
    done();
  });

  it('can get query condition when channels is set', (done) => {
    // Make mock request
    var request = {
      body: {
        channels: ['Giants', 'Mets']
      }
    }

    var where = PushRouter.getQueryCondition(request);
    expect(where).toEqual({
      'channels': {
        '$in': ['Giants', 'Mets']
      }
    });
    done();
  });

  it('can get query condition when where is set', (done) => {
    // Make mock request
    var request = {
      body: {
        'where': {
          'injuryReports': true
        }
      }
    }

    var where = PushRouter.getQueryCondition(request);
    expect(where).toEqual({
      'injuryReports': true
    });
    done();
  });

  it('can get query condition when nothing is set', (done) => {
    // Make mock request
    var request = {
      body: {
      }
    }

    expect(function() {
      PushRouter.getQueryCondition(request);
    }).toThrow();
    done();
  });

  it('can throw on getQueryCondition when channels and where are set', (done) => {
    // Make mock request
    var request = {
      body: {
        'channels': {
          '$in': ['Giants', 'Mets']
        },
        'where': {
          'injuryReports': true
        }
      }
    }

    expect(function() {
      PushRouter.getQueryCondition(request);
    }).toThrow();
    done();
  });
  
  it('sends a push through REST', (done) => {
    request.post({
      url: Parse.serverURL+"/push",
      json: true,
      body: {
        'channels': {
          '$in': ['Giants', 'Mets']
        }
      },
      headers: {
        'X-Parse-Application-Id': Parse.applicationId,
        'X-Parse-Master-Key': Parse.masterKey
      }
    }, function(err, res, body){
      expect(body.result).toBe(true);
      done();
    });
  });
});