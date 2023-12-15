export const sendXmlHttpRequest = (data: FormData) => {
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.onreadystatechange = (e) => {
        if (xhr.readyState !== 4) {
          return;
        }

        if ([200, 201].includes(xhr.status)) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject("Request Failed");
        }
      };
      xhr.open('POST', 'http://172.18.47.27:3333/points');
      ///xhr.open('POST', 'http://192.168.100.2:3333/points');
      xhr.send(data);
    });
}
