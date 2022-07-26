#[macro_use]
extern crate rocket;

use rocket::fs::{relative, FileServer};

#[launch]
async fn rocket() -> _ {
    rocket::build().mount("/", FileServer::from(relative!("build")))
}
