#![cfg(test)]

use super::*;
use soroban_sdk::{Env, String, Address};
use soroban_sdk::testutils::Address as _;

#[test]
fn test_init() {
    let env = Env::default();
    let contract_id = env.register(GovCompass, ());
    let client = GovCompassClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.init(&admin);
}

#[test]
fn test_submit_and_get() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(GovCompass, ());
    let client = GovCompassClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let citizen = Address::generate(&env);

    client.init(&admin);

    let ts = env.ledger().timestamp();
    let deadline = ts + 86400; // 1 day

    let id = client.submit(
        &citizen,
        &String::from_str(&env, "Health"),
        &String::from_str(&env, "Hospital wait times"),
        &String::from_str(&env, "Wait time exceeds 4 hours"),
        &8u32,
        &deadline,
    );

    assert_eq!(id, 1);

    let c = client.get(&id);
    assert_eq!(c.citizen, citizen);
    assert_eq!(c.department, String::from_str(&env, "Health"));
    assert_eq!(c.title, String::from_str(&env, "Hospital wait times"));
    assert_eq!(c.urgency, 8u32);
    assert_eq!(c.status, String::from_str(&env, "Submitted"));
    assert!(c.officer.is_none());
    assert!(c.resolved_at.is_none());
}

#[test]
fn test_assign_and_resolve() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(GovCompass, ());
    let client = GovCompassClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let citizen = Address::generate(&env);
    let officer = Address::generate(&env);

    client.init(&admin);

    let ts = env.ledger().timestamp();
    let id = client.submit(
        &citizen,
        &String::from_str(&env, "Health"),
        &String::from_str(&env, "Hospital issue"),
        &String::from_str(&env, "Description"),
        &5u32,
        &(ts + 86400),
    );

    client.assign(&admin, &id, &officer);
    let c = client.get(&id);
    assert_eq!(c.status, String::from_str(&env, "InReview"));
    assert_eq!(c.officer, Some(officer.clone()));

    client.resolve(&officer, &id);
    let c = client.get(&id);
    assert_eq!(c.status, String::from_str(&env, "Resolved"));
    assert!(c.resolved_at.is_some());
}

#[test]
fn test_escalate() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(GovCompass, ());
    let client = GovCompassClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let citizen = Address::generate(&env);

    client.init(&admin);

    let ts = env.ledger().timestamp();
    let id = client.submit(
        &citizen,
        &String::from_str(&env, "Health"),
        &String::from_str(&env, "Test"),
        &String::from_str(&env, "Desc"),
        &5u32,
        &(ts + 86400),
    );

    client.escalate(&admin, &id);
    let c = client.get(&id);
    assert_eq!(c.status, String::from_str(&env, "Escalated"));
}

#[test]
fn test_get_by_citizen() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(GovCompass, ());
    let client = GovCompassClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let citizen = Address::generate(&env);

    client.init(&admin);

    let ts = env.ledger().timestamp();
    let id1 = client.submit(
        &citizen,
        &String::from_str(&env, "Health"),
        &String::from_str(&env, "Issue 1"),
        &String::from_str(&env, "Desc 1"),
        &3u32,
        &(ts + 86400),
    );
    let id2 = client.submit(
        &citizen,
        &String::from_str(&env, "Roads"),
        &String::from_str(&env, "Issue 2"),
        &String::from_str(&env, "Desc 2"),
        &7u32,
        &(ts + 172800),
    );

    let complaints = client.get_by_citizen(&citizen);
    assert_eq!(complaints.len(), 2);
    assert_eq!(complaints.get(0).unwrap().id, id1);
    assert_eq!(complaints.get(1).unwrap().id, id2);
}

#[test]
fn test_get_by_department() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(GovCompass, ());
    let client = GovCompassClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let citizen = Address::generate(&env);
    let citizen2 = Address::generate(&env);

    client.init(&admin);

    let ts = env.ledger().timestamp();
    client.submit(
        &citizen,
        &String::from_str(&env, "Health"),
        &String::from_str(&env, "Issue A"),
        &String::from_str(&env, "Desc A"),
        &4u32,
        &(ts + 86400),
    );
    client.submit(
        &citizen,
        &String::from_str(&env, "Roads"),
        &String::from_str(&env, "Pothole"),
        &String::from_str(&env, "Big pothole"),
        &9u32,
        &(ts + 43200),
    );
    client.submit(
        &citizen2,
        &String::from_str(&env, "Health"),
        &String::from_str(&env, "Issue B"),
        &String::from_str(&env, "Desc B"),
        &2u32,
        &(ts + 86400),
    );

    let health = client.get_by_department(&String::from_str(&env, "Health"));
    assert_eq!(health.len(), 2);

    let roads = client.get_by_department(&String::from_str(&env, "Roads"));
    assert_eq!(roads.len(), 1);
}

#[test]
fn test_department_count() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(GovCompass, ());
    let client = GovCompassClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let citizen = Address::generate(&env);

    client.init(&admin);

    let ts = env.ledger().timestamp();
    client.submit(
        &citizen,
        &String::from_str(&env, "Health"),
        &String::from_str(&env, "A"),
        &String::from_str(&env, "D"),
        &5u32,
        &(ts + 86400),
    );

    let count = client.get_department_count(&String::from_str(&env, "Health"));
    assert_eq!(count, 1);

    let count = client.get_department_count(&String::from_str(&env, "Roads"));
    assert_eq!(count, 0);
}

#[test]
#[should_panic(expected = "not found")]
fn test_get_not_found() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(GovCompass, ());
    let client = GovCompassClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.init(&admin);
    client.get(&999);
}

#[test]
#[should_panic(expected = "wrong status")]
fn test_assign_already_assigned() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(GovCompass, ());
    let client = GovCompassClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let citizen = Address::generate(&env);
    let officer1 = Address::generate(&env);
    let officer2 = Address::generate(&env);

    client.init(&admin);

    let ts = env.ledger().timestamp();
    let id = client.submit(
        &citizen,
        &String::from_str(&env, "Health"),
        &String::from_str(&env, "Test"),
        &String::from_str(&env, "D"),
        &5u32,
        &(ts + 86400),
    );

    client.assign(&admin, &id, &officer1);
    client.assign(&admin, &id, &officer2);
}
