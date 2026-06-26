#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec};

#[contracttype]
pub enum DataKey {
    Complaint(u64),
    Counter,
    Admin,
    CitizenComplaints(Address),
    DepartmentComplaints(String),
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Complaint {
    pub id: u64,
    pub citizen: Address,
    pub department: String,
    pub title: String,
    pub description: String,
    pub urgency: u32,
    pub status: String,
    pub deadline: u64,
    pub officer: Option<Address>,
    pub created_at: u64,
    pub resolved_at: Option<u64>,
}

#[contract]
pub struct GovCompass;

#[contractimpl]
impl GovCompass {
    pub fn init(env: Env, admin: Address) {
        assert!(!env.storage().instance().has(&DataKey::Admin), "already init");
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Counter, &0u64);
    }

    pub fn submit(
        env: Env,
        citizen: Address,
        department: String,
        title: String,
        description: String,
        urgency: u32,
        deadline: u64,
    ) -> u64 {
        citizen.require_auth();
        let mut ctr: u64 = env.storage().instance().get(&DataKey::Counter).unwrap();
        ctr += 1;

        let complaint = Complaint {
            id: ctr,
            citizen: citizen.clone(),
            department: department.clone(),
            title,
            description,
            urgency,
            status: String::from_str(&env, "Submitted"),
            deadline,
            officer: None,
            created_at: env.ledger().timestamp(),
            resolved_at: None,
        };

        env.storage().persistent().set(&DataKey::Complaint(ctr), &complaint);
        env.storage().instance().set(&DataKey::Counter, &ctr);

        let mut cl: Vec<u64> = env.storage().persistent()
            .get(&DataKey::CitizenComplaints(citizen.clone()))
            .unwrap_or(Vec::new(&env));
        cl.push_back(ctr);
        env.storage().persistent().set(&DataKey::CitizenComplaints(citizen), &cl);

        let mut dl: Vec<u64> = env.storage().persistent()
            .get(&DataKey::DepartmentComplaints(department.clone()))
            .unwrap_or(Vec::new(&env));
        dl.push_back(ctr);
        env.storage().persistent().set(&DataKey::DepartmentComplaints(department), &dl);

        ctr
    }

    pub fn assign(env: Env, admin: Address, complaint_id: u64, officer: Address) {
        admin.require_auth();
        let mut c: Complaint = env.storage().persistent()
            .get(&DataKey::Complaint(complaint_id)).expect("not found");
        assert!(c.status == String::from_str(&env, "Submitted"), "wrong status");
        c.officer = Some(officer);
        c.status = String::from_str(&env, "InReview");
        env.storage().persistent().set(&DataKey::Complaint(complaint_id), &c);
    }

    pub fn resolve(env: Env, officer: Address, complaint_id: u64) {
        officer.require_auth();
        let mut c: Complaint = env.storage().persistent()
            .get(&DataKey::Complaint(complaint_id)).expect("not found");
        assert!(c.status == String::from_str(&env, "InReview"), "wrong status");
        c.status = String::from_str(&env, "Resolved");
        c.resolved_at = Some(env.ledger().timestamp());
        env.storage().persistent().set(&DataKey::Complaint(complaint_id), &c);
    }

    pub fn escalate(env: Env, admin: Address, complaint_id: u64) {
        admin.require_auth();
        let mut c: Complaint = env.storage().persistent()
            .get(&DataKey::Complaint(complaint_id)).expect("not found");
        let pending = c.status == String::from_str(&env, "Submitted")
            || c.status == String::from_str(&env, "InReview");
        assert!(pending, "already resolved or escalated");
        c.status = String::from_str(&env, "Escalated");
        env.storage().persistent().set(&DataKey::Complaint(complaint_id), &c);
    }

    pub fn get(env: Env, complaint_id: u64) -> Complaint {
        env.storage().persistent()
            .get(&DataKey::Complaint(complaint_id)).expect("not found")
    }

    pub fn get_by_citizen(env: Env, citizen: Address) -> Vec<Complaint> {
        let ids: Vec<u64> = env.storage().persistent()
            .get(&DataKey::CitizenComplaints(citizen)).unwrap_or(Vec::new(&env));
        let mut res = Vec::new(&env);
        for i in 0..ids.len() {
            res.push_back(env.storage().persistent()
                .get(&DataKey::Complaint(ids.get(i).unwrap())).unwrap());
        }
        res
    }

    pub fn get_by_department(env: Env, department: String) -> Vec<Complaint> {
        let ids: Vec<u64> = env.storage().persistent()
            .get(&DataKey::DepartmentComplaints(department)).unwrap_or(Vec::new(&env));
        let mut res = Vec::new(&env);
        for i in 0..ids.len() {
            res.push_back(env.storage().persistent()
                .get(&DataKey::Complaint(ids.get(i).unwrap())).unwrap());
        }
        res
    }

    pub fn get_department_count(env: Env, department: String) -> u32 {
        let v: Vec<u64> = env.storage().persistent()
            .get(&DataKey::DepartmentComplaints(department))
            .unwrap_or(Vec::new(&env));
        v.len()
    }
}

mod test;
