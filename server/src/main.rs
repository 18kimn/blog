#[macro_use]
extern crate rocket;

use rocket::fs::{relative, FileServer};
use std::fs::{read_to_string, write};
use std::io::Result;

struct Options {
    name: String,
    date: String,
}

#[post("/<>/<>/")]
async fn update() -> Result<String> {
    let feeds = &refresh::refresh().await.unwrap();
    write("test.json", feeds)?;
    return Ok(String::from(feeds));
}

#[launch]
async fn rocket() -> _ {
    rocket::build()
        .mount("/", FileServer::from(relative!("build")))
        .mount("/feed", routes![send_feed])
}
